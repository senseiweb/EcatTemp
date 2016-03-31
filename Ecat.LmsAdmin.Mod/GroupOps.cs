using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.BbWs.BbCourse;
using Ecat.Shared.DbMgr.BbWs.BbMbrs;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.LmsAdmin.Mod
{
    using GroupMemberMap = Dictionary<GmrGroup, List<GroupMembershipVO>>;
    public class GroupOps: ILmsAdminGroupOps
    {
        private readonly EcatContext _mainCtx;
        private readonly BbWsCnet _bbWs;
        public ProfileFaculty Faculty { get; set; }

        public GroupOps(EcatContext mainCtx, BbWsCnet bbWs)
        {
            _mainCtx = mainCtx;
            _bbWs = bbWs;
        }

        public async Task<Course> GetCourseGroups(int courseId)
        {
            var query = await _mainCtx.Courses
                .Where(crse => crse.Id == courseId)
                .Select(crse => new
                {
                    crse,
                    crse.WorkGroups,
                    Faculty = crse.Faculty
                        .Where(fic => crse.WorkGroups.Select(wg => wg.ModifiedById).Contains(fic.FacultyPersonId))
                        .Select(fic => new
                        {
                            fic,
                            fic.FacultyProfile,
                            fic.FacultyProfile.Person
                        })
                }).SingleAsync();

            var course = query.crse;
            course.Faculty = query.Faculty.Select(f => f.fic).ToList();
            return course;
        }

        public async Task<WorkGroup> GetWorkGroupMembers(int workGroupId)
        {
            var query = await _mainCtx.WorkGroups
                .Where(wg => wg.Id == workGroupId)
                .Select(wg => new
                {
                    wg,
                    Gm = wg.GroupMembers.Where(gm => !gm.IsDeleted)
                        .Select(gm => new
                        {
                            gm,
                            gm.StudentProfile,
                            gm.StudentProfile.Person
                        })
                }).SingleAsync();

            var workGroup = query.wg;
            workGroup.GroupMembers = query.Gm.Select(g =>g.gm).ToList();
            return workGroup;
        }

        public async Task<GroupReconResult> ReconcileGroups(int courseId)
        {
            var ecatCourse = await _mainCtx.Courses
                .Where(course => course.Id == courseId)
                .Include(course => course.WorkGroups)
                .SingleAsync();

            var groupFilter = new GroupFilter
            {
                filterType = (int) GroupFilterType.GetGroupByCourseId,
                filterTypeSpecified = true,
                availableSpecified = true,
                available = true,
            };

            var client = await _bbWs.GetCourseClient();
            var autoRetry = new Retrier<getGroupResponse>();
            var query = await autoRetry.Try(() => client.getGroupAsync(ecatCourse.BbCourseId, groupFilter), 3);
            var bbGroups = query.@return;
            var courseGroups = ecatCourse.WorkGroups;

            var reconResult = new GroupReconResult
            {
                Id = Guid.NewGuid(),
                AcademyId = Faculty?.AcademyId,
                Groups = new List<WorkGroup>()
            };

            if (bbGroups == null) return reconResult;

            var groupNeedToCreate = bbGroups
                .Where(bbg => !courseGroups.Select(wg => wg.BbGroupId).Contains(bbg.id))
                .Where(bbg => bbg.title.ToLower().StartsWith("bc")).ToList();

            if (!groupNeedToCreate.Any()) return reconResult;

            var edLevel = StaticAcademy.AcadLookupById
                .First(acad => acad.Key == Faculty.AcademyId)
                .Value
                .MpEdLevel;

            var wgModels = await _mainCtx.WgModels
                .Where(wg => wg.IsActive && wg.MpEdLevel == edLevel).ToListAsync();

            var newGroups = groupNeedToCreate.Select(bbg =>
                    {
                        var groupMapper = bbg.title.Split('-');
                        string category;
                        switch (groupMapper[0])
                        {
                            case "BC1":
                                category = MpGroupCategory.Wg1;
                                break;
                            case "BC2":
                                category= MpGroupCategory.Wg2;
                                break;;
                            case "BC3":
                                category = MpGroupCategory.Wg3;
                                break;
                            case "BC4":
                                category = MpGroupCategory.Wg4;
                                break;
                            default:
                                category =  MpGroupCategory.None;
                                break;
                        }
                        return new WorkGroup
                        {
                            BbGroupId = bbg.id,
                            CourseId = ecatCourse.Id,
                            MpCategory = category,
                            GroupNumber = groupMapper[1].Substring(1),
                            DefaultName = groupMapper[2],
                            MpSpStatus = MpSpStatus.Open,
                            ModifiedById = Faculty.PersonId,
                            ModifiedDate = DateTime.Now,
                            ReconResultId = reconResult.Id,
                            AssignedSpInstrId = wgModels.FindLast(wgm => wgm.MpWgCategory == category).AssignedSpInstrId,
                            WgModel = wgModels.First(wgm => wgm.MpWgCategory == category)
                        };
                    });

            foreach (var grp in newGroups)
            {
                reconResult.NumAdded += 1;
                reconResult.Groups.Add(grp);
                _mainCtx.WorkGroups.Add(grp);
            }
            await _mainCtx.SaveChangesAsync();
            return reconResult;
        }

        public async Task<GroupMemReconResult> ReconcileGroupMembers(int wgId)
        {
            var crseWithWorkgroup = await _mainCtx.Courses
                .Where(crse => crse.WorkGroups.Any(wg => wg.Id == wgId))
                .Select(crse => new GroupMemberReconcile
                {
                    CrseId = crse.Id,
                    BbCrseId = crse.BbCourseId,
                    WorkGroups = crse.WorkGroups.Where(wg => wg.Id == wgId).Select(wg => new GmrGroup
                    {
                        WgId = wg.Id,
                        BbWgId = wg.BbGroupId,
                        Category = wg.MpCategory,
                        Name = wg.DefaultName,
                        Members = wg.GroupMembers.Select(gm => new GmrMember
                        {
                            StudentId = gm.StudentId,
                            BbGroupMemId = gm.BbCrseStudGroupId,
                            IsDeleted = gm.IsDeleted,
                            HasChildren = gm.AuthorOfComments.Any() ||
                                          gm.AssesseeSpResponses.Any() ||
                                          gm.AssessorSpResponses.Any() ||
                                          gm.AssesseeStratResponse.Any() ||
                                          gm.AssessorStratResponse.Any() ||
                                          gm.RecipientOfComments.Any()
                        }).ToList()
                    }).ToList()
                })
                .FirstAsync();

            var reconResults = await DoReconciliation(crseWithWorkgroup);

            return reconResults.SingleOrDefault();
        }

        public async Task<List<GroupMemReconResult>> ReconcileGroupMembers(int courseId, string groupCategory)
        {
            var crseWithWorkgroup = await _mainCtx.Courses
                .Where(crse => crse.Id == courseId)
                .Select(crse => new GroupMemberReconcile
                {
                    CrseId = crse.Id,
                    BbCrseId = crse.BbCourseId,
                    WorkGroups = crse.WorkGroups.Where(wg => wg.MpCategory == groupCategory)
                        .Select(wg => new GmrGroup
                        {
                            WgId = wg.Id,
                            BbWgId = wg.BbGroupId,
                            Category = wg.MpCategory,
                            Name = wg.DefaultName,
                            Members = wg.GroupMembers.Select(gm => new GmrMember
                            {
                                StudentId = gm.StudentId,
                                BbGroupMemId = gm.BbCrseStudGroupId,
                                IsDeleted = gm.IsDeleted,
                                HasChildren = gm.AuthorOfComments.Any() ||
                                              gm.AssesseeSpResponses.Any() ||
                                              gm.AssessorSpResponses.Any() ||
                                              gm.AssesseeStratResponse.Any() ||
                                              gm.AssessorStratResponse.Any() ||
                                              gm.RecipientOfComments.Any()
                            }).ToList()
                        }).ToList()
                })
                .FirstAsync();

            return await DoReconciliation(crseWithWorkgroup);
        }

        private async Task<List<GroupMemReconResult>> DoReconciliation(GroupMemberReconcile crseGroupToReconcile)
        {
            var allGroupMemsId = crseGroupToReconcile.WorkGroups.Select(wg => wg.BbWgId).ToArray();

            var client = await _bbWs.GetMemClient();
            var autoRetry = new Retrier<getGroupMembershipResponse>();
            var filter = new MembershipFilter
            {
                filterTypeSpecified = true,
                filterType = (int)GrpMemFilterType.LoadByGrpId,
                groupIds = allGroupMemsId
            };

            var query = await autoRetry.Try(() => client.getGroupMembershipAsync(crseGroupToReconcile.BbCrseId, filter), 3);

            var allBbGrpMems = query.@return;

            var wgWithNewMembers = new Dictionary<GmrGroup, List<GroupMembershipVO>>();

            foreach (var grpMem in allBbGrpMems.GroupBy(bbgm => bbgm.groupId))
            {
                var relatedWg = crseGroupToReconcile.WorkGroups.Single(wg => wg.BbWgId == grpMem.Key);

                var existingGrpMemBbIds = relatedWg.Members
                    .Where(mem => !mem.IsDeleted)
                    .Select(mem => mem.BbGroupMemId)
                    .ToList();

                var newGroupMem = grpMem.Where(gm => !existingGrpMemBbIds.Contains(gm.groupMembershipId))
                    .Select(gm => gm)
                    .ToList();

                var currentBbGmIds = grpMem.Select(gm => gm.groupMembershipId);
                var removedGroupMem = existingGrpMemBbIds.Where(egmid => !currentBbGmIds.Contains(egmid)).ToList();

                if (!newGroupMem.Any() && !removedGroupMem.Any()) continue;

                relatedWg.ReconResult = new GroupMemReconResult
                {
                    Id = Guid.NewGuid(),
                    WorkGroupId = relatedWg.WgId,
                    AcademyId = Faculty.AcademyId,
                    GroupType = relatedWg.Category,
                    WorkGroupName = relatedWg.Name,
                    CourseId = crseGroupToReconcile.CrseId,
                    GroupMembers = new List<CrseStudentInGroup>()
                };

                foreach (var gm in removedGroupMem.Select(rgmId => relatedWg.Members.Single(mem => mem.BbGroupMemId == rgmId)))
                {
                    gm.PendingRemoval = true;
                }

                wgWithNewMembers.Add(relatedWg, newGroupMem);
            }

            if (wgWithNewMembers.Any())
            {
             wgWithNewMembers = await AddGroupMembers(crseGroupToReconcile.CrseId, wgWithNewMembers);
            }

            wgWithNewMembers = await RemoveOrFlag(crseGroupToReconcile.CrseId, wgWithNewMembers);

            var studInGroups = wgWithNewMembers
                .SelectMany(wg => wg.Key.ReconResult.GroupMembers)
                .Select(wg => wg.StudentId)
                .Distinct();

            await _mainCtx.Students
                .Where(stud => studInGroups.Contains(stud.PersonId))
                .Include(stud => stud.Person)
                .ToListAsync();

            var reconResults =  wgWithNewMembers.Select(wg => wg.Key.ReconResult).ToList();

            return reconResults;
        } 

        private async Task<GroupMemberMap> AddGroupMembers(int crseId, GroupMemberMap grpsWithMemToAdd)
        {

            //Deal with members that were previously removed from the group, flagged as deleted and then added
            //back to the group

            var studentsToReactivate = new List<CrseStudentInGroup>();

            foreach (var gmrGroup in grpsWithMemToAdd)
            {
                var newMemberIds = gmrGroup.Value.Select(gmvo => gmvo.groupMembershipId);

                var exisitingMembersWithDeletedFlag = gmrGroup.Key.Members.Where(mem => newMemberIds.Contains(mem.BbGroupMemId) && mem.IsDeleted).ToList();

                if (!exisitingMembersWithDeletedFlag.Any()) continue;

                gmrGroup.Key.ReconResult.NumAdded += exisitingMembersWithDeletedFlag.Count;

                var studentsInGroup = exisitingMembersWithDeletedFlag.Select(emwdg => new CrseStudentInGroup
                {
                    StudentId = emwdg.StudentId,
                    CourseId = crseId,
                    WorkGroupId = gmrGroup.Key.WgId,
                    IsDeleted = false,
                    DeletedDate = null,
                    DeletedById = null,
                    ModifiedById = Faculty.PersonId,
                    ModifiedDate = DateTime.Now
                });

                studentsToReactivate.AddRange(studentsInGroup);
            }

            if (studentsToReactivate.Any())
            {
                foreach (var str in studentsToReactivate)
                {
                    _mainCtx.Entry(str).State = EntityState.Modified;
                }

                await _mainCtx.SaveChangesAsync();
            }

            var studentToLookUp = grpsWithMemToAdd
                .SelectMany(gm => gm.Value)
                .Select(gm => gm.courseMembershipId)
                .Distinct();

            var students = await _mainCtx.StudentInCourses
                .Where(stud => stud.CourseId == crseId)
                .Where(stud => studentToLookUp.Contains(stud.BbCourseMemId))
                .Where(stud => !stud.IsDeleted)
                .Select(stud => new
                {
                    stud.BbCourseMemId,
                    stud.Student.Person.BbUserId,
                    stud.Student.PersonId
                })
                .ToListAsync();

            var additions = new List<CrseStudentInGroup>();

            foreach (var gwmta in grpsWithMemToAdd)
            {
                foreach (var studInGroup in 
                    from memVo in gwmta.Value
                    let relatedStudent =
                        students.SingleOrDefault(stud => stud.BbCourseMemId == memVo.courseMembershipId)
                    where relatedStudent != null
                    select new CrseStudentInGroup
                    {
                        StudentId = relatedStudent.PersonId,
                        CourseId = crseId,
                        WorkGroupId = gwmta.Key.WgId,
                        HasAcknowledged = false,
                        BbCrseStudGroupId = memVo.groupMembershipId,
                        IsDeleted = false,
                        ModifiedById = Faculty?.PersonId,
                        ModifiedDate = DateTime.Now,
                        ReconResultId = gwmta.Key.ReconResult.Id
                    })
                {
                    additions.Add(studInGroup);
                    gwmta.Key.ReconResult.NumAdded += 1;
                    gwmta.Key.ReconResult.GroupMembers.Add(studInGroup);
                }
            }
            _mainCtx.StudentInGroups.AddRange(additions);
            await _mainCtx.SaveChangesAsync();

            return grpsWithMemToAdd;
        }

        private async Task<GroupMemberMap> RemoveOrFlag(int crseId, GroupMemberMap grpWithMems)
        {
            foreach (var group in grpWithMems.Keys)
            {
                foreach (var gmrMember in group.Members.Where(mem => mem.PendingRemoval))
                {
                    var grpMember = new CrseStudentInGroup
                    {
                        WorkGroupId = group.WgId,
                        CourseId = crseId,
                        StudentId = gmrMember.StudentId
                    };

                    if (gmrMember.HasChildren)
                    {
                        grpMember.IsDeleted = true;
                        grpMember.DeletedById = Faculty?.PersonId;
                        grpMember.DeletedDate = DateTime.Now;
                        _mainCtx.Entry(grpMember).State = EntityState.Modified;
                    }
                    else
                    {
                        _mainCtx.Entry(grpMember).State = EntityState.Deleted;
                    }
                    group.ReconResult.NumRemoved += 1;
                }
            }
             await _mainCtx.SaveChangesAsync();
            return grpWithMems;
        }
    }
}
