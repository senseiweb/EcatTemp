﻿using System;
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
using Ecat.Shared.DbMgr.BbWs.BbGrades;
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
                .Where(wg => wg.WorkGroupId == workGroupId)
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

            var autoRetry = new Retrier<GroupVO[]>();
            var bbGroups = await autoRetry.Try(() => _bbWs.BbWorkGroups(ecatCourse.BbCourseId, groupFilter), 3);

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
                .Where(crse => crse.WorkGroups.Any(wg => wg.WorkGroupId == wgId))
                .Select(crse => new GroupMemberReconcile
                {
                    CrseId = crse.Id,
                    BbCrseId = crse.BbCourseId,
                    WorkGroups = crse.WorkGroups.Where(wg => wg.WorkGroupId == wgId).Select(wg => new GmrGroup
                    {
                        WgId = wg.WorkGroupId,
                        BbWgId = wg.BbGroupId,
                        Category = wg.MpCategory,
                        Name = wg.DefaultName,
                        Members = wg.GroupMembers.Select(gm => new GmrMember
                        {
                            StudentId = gm.StudentId,
                            BbGroupMemId = gm.BbCrseStudGroupId,
                            BbCrseMemId = gm.StudentInCourse.BbCourseMemId,
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
                            WgId = wg.WorkGroupId,
                            BbWgId = wg.BbGroupId,
                            Category = wg.MpCategory,
                            Name = wg.DefaultName,
                            Members = wg.GroupMembers.Select(gm => new GmrMember
                            {
                                StudentId = gm.StudentId,
                                BbGroupMemId = gm.BbCrseStudGroupId,
                                BbCrseMemId = gm.StudentInCourse.BbCourseMemId,
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
            var allGroupBbIds = crseGroupToReconcile.WorkGroups.Select(wg => wg.BbWgId).ToArray();

            var autoRetry = new Retrier<GroupMembershipVO[]>();
            var filter = new MembershipFilter
            {
                filterTypeSpecified = true,
                filterType = (int)GrpMemFilterType.LoadByGrpId,
                groupIds = allGroupBbIds
            };

            var allBbGrpMems = await autoRetry.Try(() => _bbWs.BbGroupMembership(crseGroupToReconcile.BbCrseId, filter), 3);

            var wgsWithChanges = new Dictionary<GmrGroup, List<GroupMembershipVO>>();

            foreach (var grpMem in allBbGrpMems.GroupBy(bbgm => bbgm.groupId))
            {
                var relatedWg = crseGroupToReconcile.WorkGroups.Single(wg => wg.BbWgId == grpMem.Key);

                var existingCrseMemBbIds = relatedWg.Members
                    .Where(mem => !mem.IsDeleted)
                    .Select(mem => mem.BbCrseMemId)
                    .ToList();

                var changeGrpMem = grpMem.Where(gm => !existingCrseMemBbIds.Contains(gm.courseMembershipId))
                    .Select(gm => gm)
                    .ToList();

                var currentBbGmIds = grpMem.Select(gm => gm.courseMembershipId);
                var removedGroupMem = existingCrseMemBbIds.Where(ecmid => !currentBbGmIds.Contains(ecmid)).ToList();

                if (!changeGrpMem.Any() && !removedGroupMem.Any()) continue;

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

                foreach (var gm in removedGroupMem.Select(rgmId => relatedWg.Members.Single(mem => mem.BbCrseMemId == rgmId)))
                {
                    gm.PendingRemoval = true;
                }

                wgsWithChanges.Add(relatedWg, changeGrpMem);
            }

            if (wgsWithChanges.Any(wgwc => wgwc.Value.Any()))
                wgsWithChanges = await AddGroupMembers(crseGroupToReconcile.CrseId, wgsWithChanges);

            if (wgsWithChanges.SelectMany(wg => wg.Key.Members).Any(gm => gm.PendingRemoval))
                wgsWithChanges = await RemoveOrFlag(crseGroupToReconcile.CrseId, wgsWithChanges);

            if (wgsWithChanges.Any())
            {
                var ids = wgsWithChanges.Select(wg => wg.Key.WgId);
                var svrWgMembers = await (from wg in _mainCtx.WorkGroups
                    where ids.Contains(wg.WorkGroupId)
                    select new
                    {
                        wg,
                        GroupMembers = wg.GroupMembers.Where(gm => !gm.IsDeleted).Select(gm => new
                        {
                            gm,
                            gm.StudentProfile,
                            gm.StudentProfile.Person
                        })
                    }).ToListAsync();
                                          
                foreach (var wg in wgsWithChanges)
                {
                    wg.Key.ReconResult.GroupMembers =  svrWgMembers.Single(swg => swg.wg.WorkGroupId == wg.Key.WgId)
                            .GroupMembers.Select(gm => gm.gm).ToList();
                }
            }

            var reconResults = wgsWithChanges.Select(wg => wg.Key.ReconResult).ToList();

            return reconResults;
        } 

        private async Task<GroupMemberMap> AddGroupMembers(int crseId, GroupMemberMap grpsWithMemToAdd)
        {
            //Deal with members that were previously removed from the group, flagged as deleted and then added
            //back to the group

            var studentsToReactivate = new List<CrseStudentInGroup>();
            var reActivateStudIds = new List<string>();

            foreach (var gmrGroup in grpsWithMemToAdd)
            {
                var newMemberCrseIds = gmrGroup.Value.Select(gmvo => gmvo.courseMembershipId);

                var exisitingMembersWithDeletedFlag = gmrGroup.Key.Members
                    .Where(mem => newMemberCrseIds.Contains(mem.BbCrseMemId) && mem.IsDeleted)
                    .ToList();
               
                if (!exisitingMembersWithDeletedFlag.Any()) continue;

                gmrGroup.Key.ReconResult.NumAdded += exisitingMembersWithDeletedFlag.Count;

                var studentsInGroup = exisitingMembersWithDeletedFlag.Select(emwdg => new CrseStudentInGroup
                {
                    StudentId = emwdg.StudentId,
                    CourseId = crseId,
                    WorkGroupId = gmrGroup.Key.WgId,
                    BbCrseStudGroupId = emwdg.BbGroupMemId,
                    IsDeleted = false,
                    DeletedDate = null,
                    DeletedById = null,
                    ModifiedById = Faculty.PersonId,
                    ModifiedDate = DateTime.Now
                });

                studentsToReactivate.AddRange(studentsInGroup);
                reActivateStudIds.AddRange(exisitingMembersWithDeletedFlag.Select(emwdg => emwdg.BbCrseMemId));
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
                .Where(gm => !reActivateStudIds.Contains(gm.courseMembershipId))
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
                var gmsPendingRemovalWithChildren = group.Members.Where(mem => mem.PendingRemoval && mem.HasChildren).Select(mem => mem.StudentId).ToList();

                if (gmsPendingRemovalWithChildren.Any())
                {
                    var existingStudToFlag =
                        await _mainCtx.StudentInGroups.Where(
                            sig =>
                                gmsPendingRemovalWithChildren.Contains(sig.StudentId) && sig.WorkGroupId == group.WgId)
                            .ToListAsync();

                    foreach (var sig in existingStudToFlag)
                    {
                        sig.IsDeleted = true;
                        sig.DeletedById = Faculty?.PersonId;
                        sig.DeletedDate = DateTime.Now;
                        sig.ModifiedById = Faculty?.PersonId;
                        sig.ModifiedDate = DateTime.Now;
                    }
                }

                foreach (
                    var gmrMember in
                        group.Members.Where(mem => mem.PendingRemoval && !mem.HasChildren)
                            .Select(mem => new CrseStudentInGroup
                            {
                                WorkGroupId = group.WgId,
                                CourseId = crseId,
                                StudentId = mem.StudentId,
                            }))
                {
                    _mainCtx.Entry(gmrMember).State = EntityState.Deleted;
                }

                group.ReconResult.NumRemoved = group.Members.Count(mem => mem.PendingRemoval);
            }
             await _mainCtx.SaveChangesAsync();
            return grpWithMems;
        }

        public async Task<SaveGradeResult> SyncBbGrades(int crseId, string wgCategory) {

            var result = new SaveGradeResult() {
                CourseId = crseId,
                WgCategory = wgCategory,
                Success = false,
                SentScores = 0,
                ReturnedScores = 0,
                NumOfStudents = 0,
                Message = "Bb Gradebook Sync"
            };

            var groups = await _mainCtx.WorkGroups.Where(wg => wg.CourseId == crseId && wg.MpCategory == wgCategory && wg.GroupMembers.Any())
                .Include(wg => wg.WgModel)
                .Include(wg => wg.Course)
                .Include(wg => wg.GroupMembers)
                .ToListAsync();

            if (!groups.Any()) {
                result.Success = false;
                result.Message = "No flights with enrolled students found ";
                return result;
            }

            var grpIds = new List<int>();
            foreach (var group in groups) {
                if (group.MpSpStatus != MpSpStatus.Published) {
                    var notDeleted = group.GroupMembers.Where(mem => mem.IsDeleted == false).Count();
                    if (notDeleted > 0)
                    {
                        result.Success = false;
                        result.Message = "All flights with enrollments must be published to sync grades";
                        return result;
                    }
                    else { continue; }
                }
                grpIds.Add(group.WorkGroupId);
            }

            var bbCrseId = groups[0].Course.BbCourseId;

            var model = groups[0].WgModel;
            if (model.StudStratCol == null) {
                result.Success = false;
                result.Message = "Error matching ECAT and Blackboard Columns";
                return result;
            }

            string[] name = { model.StudStratCol };

            var columnFilter = new ColumnFilter
            {
                filterType = (int)ColumnFilterType.GetColumnByCourseIdAndColumnName,
                filterTypeSpecified = true,
                names = name
            };

            var columns = new List<ColumnVO>();
            var autoRetry = new Retrier<ColumnVO[]>();
            var wsColumn = await autoRetry.Try(() => _bbWs.BbColumns(bbCrseId, columnFilter), 3);

            if (wsColumn[0] == null || wsColumn.Length > 1)
            {
                result.Success = false;
                result.Message = "Error matching ECAT and Blackboard Columns";
                return result;
            }

            columns.Add(wsColumn[0]);
            
            //If you specify column names in the column filter, Bb only brings back the column that matches the first name in the names array for some reason
            //So either we go get all 100+ columns and filter it for what we want or we hit the WS twice...
            if (model.MaxStratFaculty > 0 && model.FacStratCol != null) {
                name[0] = model.FacStratCol;
                columnFilter.names = name;
                wsColumn = await autoRetry.Try(() => _bbWs.BbColumns(bbCrseId, columnFilter), 3);

                if (wsColumn[0] == null || wsColumn.Length > 1)
                {
                    result.Success = false;
                    result.Message = "Error matching ECAT and Blackboard Columns";
                    return result;
                }

                columns.Add(wsColumn[0]);
            }

            var stratResults = await (from str in _mainCtx.SpStratResults
                                      where grpIds.Contains(str.WorkGroupId)
                                      select new
                                      {
                                          stratResult = str,
                                          person = str.ResultFor.StudentProfile.Person
                                      }).ToListAsync();

            var scoreVOs = new List<ScoreVO>();
            foreach (var str in stratResults) {
                var studScore = new ScoreVO
                {
                    userId = str.person.BbUserId,
                    courseId = bbCrseId,
                    columnId = columns[0].id,
                    manualGrade = str.stratResult.StudStratAwardedScore.ToString(),
                    manualScore = decimal.ToDouble(str.stratResult.StudStratAwardedScore),
                    manualScoreSpecified = true
                };
                result.SentScores += 1;
                scoreVOs.Add(studScore);

                if (model.MaxStratFaculty > 0 && model.FacStratCol != null)
                {
                    var facScore = new ScoreVO
                    {
                        userId = str.person.BbUserId,
                        courseId = bbCrseId,
                        columnId = columns[1].id,
                        manualGrade = str.stratResult.FacStratAwardedScore.ToString(),
                        manualScore = decimal.ToDouble(str.stratResult.FacStratAwardedScore),
                        manualScoreSpecified = true
                    };
                    result.SentScores += 1;
                    scoreVOs.Add(facScore);
                }

                result.NumOfStudents += 1;
            }

            //send to Bb
            var autoRetry2 = new Retrier<saveGradesResponse>();
            var scoreReturn = await autoRetry2.Try(() => _bbWs.SaveGrades(bbCrseId, scoreVOs.ToArray()), 3);
            
            result.ReturnedScores = scoreReturn.@return.Length;
            if (result.ReturnedScores != result.SentScores)
            {
                result.Message += " recieved a different number of scores than sent";
                if (scoreReturn.@return[0] == null)
                {
                    result.Success = false;
                    result.Message = "Something went wrong with the connection to Blackboard";
                    return result;
                }
            }
            result.Success = true;
            return result;
        }
    }
}
