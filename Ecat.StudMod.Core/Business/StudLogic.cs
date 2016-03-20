using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{

    public class StudLogic : IStudLogic
    {
        private readonly IStudRepo _repo;

        public Person StudentPerson { get; set; }

        public StudLogic(IStudRepo repo)
        {
            _repo = repo;
        }

        public SaveResult ClientSave(JObject saveBundle)
        {
           
            return _repo.ClientSaveChanges(saveBundle);
        }

        async Task<List<Course>> IStudLogic.GetCourses(int? crseId)
        {
            var studentCourseInit = (from csig in _repo.CrseStudentInGroups
                where csig.StudentId == StudentPerson.PersonId &&
                      !csig.IsDeleted
                let latestGrp = csig.Course.WorkGroups
                    .Where(wg => wg.GroupMembers.Any(mem => mem.StudentId == StudentPerson.PersonId && !mem.IsDeleted))
                    .OrderByDescending(grp => grp.MpCategory)
                    .FirstOrDefault()
                let gm = latestGrp.GroupMembers.Where(gm => !gm.IsDeleted)
                select new
                {
                    csig.StudentId,
                    csig.CourseId,
                    csig.WorkGroupId,
                    LatestGrpId = latestGrp.Id,
                    csig.Course,
                    csig.WorkGroup,
                    csig.HasAcknowledged,
                    GroupMembers = gm,
                    Instrument = latestGrp.AssignedSpInstr,
                    Inventories = latestGrp.AssignedSpInstr.InventoryCollection,
                    GroupPeersPerson = gm.Select(mem => mem.StudentProfile.Person),
                    GroupPeersProfile = gm.Select(mem => mem.StudentProfile),
                    MyAssesses =
                        gm.SelectMany(g => g.AssessorSpResponses)
                            .Where(g => g.AssessorPersonId == StudentPerson.PersonId),
                    MyStrats =
                        gm.SelectMany(g => g.AssessorStratResponse)
                            .Where(g => g.AssessorPersonId == StudentPerson.PersonId),
                    MyComments =
                        gm.SelectMany(g => g.AuthorOfComments)
                        .Where(g => g.AuthorPersonId == StudentPerson.PersonId),
                   MyFlags =
                        gm.SelectMany(g => g.AuthorOfComments.Select(aoc => aoc.Flag))
                        .Where(g => g.AuthorPersonId == StudentPerson.PersonId)
                });

          var studInCrseList = crseId != null ? await studentCourseInit.Where(crse => crse.CourseId == crseId).ToListAsync() : await studentCourseInit.ToListAsync();

            var courses = studInCrseList.GroupBy(csig => csig.Course);
            var studentCourses = new List<Course>();

            foreach (var course in courses)
            {
                var c = course.Key;

                c.StudentsInCourse = course.Select(csig => new StudentInCourse
                {
                    CourseId = c.Id,
                    StudentPersonId = csig.StudentId
                }).ToList();

                c.WorkGroups = course.Select(csig => csig.WorkGroup).ToList();
                studentCourses.Add(c);
            }

            //.Select(csig => new Course
            //{
            //    StudentInCrseGroups = new CrseStudentInGroup { 
            //    StudentId = csig.StudentId,
            //    CourseId = csig.Course.Id,
            //    WorkGroupId = csig.WorkGroupId,
            //    Course = csig.Course,
            //    WorkGroup = csig.WorkGroup,
            //    }
            //}).ToList();


            var latestGrpId = studentCourseInit.FirstOrDefault()?.LatestGrpId;
            var latestWorkgroup = studentCourses.SelectMany(sc => sc.WorkGroups).Single(wg => wg.Id == latestGrpId);
            latestWorkgroup.GroupMembers = studentCourseInit.SelectMany(g => g.GroupMembers).ToList();
            latestWorkgroup.SpComments = studentCourseInit.SelectMany(sp => sp.MyComments).ToList();
            latestWorkgroup.SpResponses = studentCourseInit.SelectMany(sp => sp.MyAssesses).ToList();
            latestWorkgroup.SpStratResponses = studentCourseInit.SelectMany(sp => sp.MyStrats).ToList();
            latestWorkgroup.AssignedSpInstr = studentCourseInit.First().Instrument;
            latestWorkgroup.AssignedSpInstr.InventoryCollection = studentCourseInit.First().Inventories.ToList();

            foreach (var comment in latestWorkgroup.SpComments)
            {
                comment.Flag = studentCourseInit.SelectMany(g => g.MyFlags)
                    .First(c => c.AuthorPersonId == comment.AuthorPersonId && c.RecipientPersonId == comment.RecipientPersonId);
            }

            foreach (var grpMem in latestWorkgroup.GroupMembers)
            {
                grpMem.StudentProfile = studentCourseInit
                    .SelectMany(g => g.GroupPeersProfile)
                    .First(g => g.PersonId == grpMem.StudentId);

                grpMem.StudentProfile.Person = studentCourseInit
                    .SelectMany(g => g.GroupPeersPerson)
                    .Where(gp => gp.PersonId != StudentPerson.PersonId)
                    .First(g => g.PersonId == grpMem.StudentId);
            }
            return studentCourses;
        }

        async Task<WorkGroup> IStudLogic.GetWorkGroup(int wgId)
        {
            var singleGroup = await (from csig in _repo.CrseStudentInGroups
                where csig.StudentId == StudentPerson.PersonId &&
                      !csig.IsDeleted &&
                      csig.WorkGroupId == wgId
                let peers = csig.WorkGroup.GroupMembers.Where(gm => !gm.IsDeleted)
                select new
                {
                    csig.StudentId,
                    csig.CourseId,
                    csig.WorkGroupId,
                    csig.Course,
                    csig.WorkGroup,
                    csig.HasAcknowledged,
                    GroupMembers = peers,
                    Instrument = csig.WorkGroup.AssignedSpInstr,
                    Inventories = csig.WorkGroup.AssignedSpInstr.InventoryCollection,
                    GroupPeersPerson = peers.Select(mem => mem.StudentProfile.Person),
                    GroupPeersProfile = peers.Select(mem => mem.StudentProfile),
                    MyAssesses =
                        peers.SelectMany(g => g.AssessorSpResponses)
                            .Where(g => g.AssessorPersonId == StudentPerson.PersonId),
                    MyStrats =
                        peers.SelectMany(g => g.AssessorStratResponse)
                            .Where(g => g.AssessorPersonId == StudentPerson.PersonId),
                    MyComments =
                        peers.SelectMany(g => g.AuthorOfComments)
                            .Where(g => g.AuthorPersonId == StudentPerson.PersonId),
                    MyFlags = peers.SelectMany(g => g.AuthorOfComments.Select(aoc => aoc.Flag))
                        .Where(g => g.AuthorPersonId == StudentPerson.PersonId)
                }).SingleAsync();


            var requestedWorkGroup = singleGroup.WorkGroup;

            requestedWorkGroup.GroupMembers = singleGroup.GroupMembers.Where(gm => gm.StudentId != StudentPerson.PersonId).ToList();
            requestedWorkGroup.SpResponses = singleGroup.MyAssesses.ToList();
            requestedWorkGroup.SpStratResponses = singleGroup.MyStrats.ToList();
            requestedWorkGroup.SpComments = singleGroup.MyComments.ToList();

            foreach (var comment in requestedWorkGroup.SpComments)
            {
                comment.Flag = singleGroup.MyFlags.First(c => c.AuthorPersonId == comment.AuthorPersonId && c.RecipientPersonId == comment.RecipientPersonId);
            }

            return requestedWorkGroup;
        }

        async Task<SpResult> IStudLogic.GetWrkGrpResult(int wgId, bool addInstrument)
        {
            var grpId = wgId;

            var svrWg = await _repo
                .WorkGroups(addInstrument)
                .Where(wg => wg.MpSpStatus == MpSpStatus.Published)
                .Where(wg => wg.Id == grpId)
                .SingleOrDefaultAsync(
                    wg => wg.GroupMembers.Any(gm => !gm.IsDeleted && gm.StudentId == StudentPerson.PersonId));


            if (svrWg == null)
            {
                return null;
            }

            var pubResult =
                await
                    _repo.SpResult.Where(
                        result => result.WorkGroupId == wgId && result.StudentId == StudentPerson.PersonId)
                        .SingleOrDefaultAsync();

            if (pubResult == null)
            {
                return null;
            }

            var groupMembers = await _repo.CrseStudentInGroups
                .Where(gm => gm.WorkGroupId == grpId)
                .Include(comment => comment.RecipientOfComments)
                .Include(comment => comment.AuthorOfComments.Select(aoc => aoc.Author.StudentProfile.Person))
                .Include(c => c.RecipientOfComments.Select(cf => cf.Flag))
                .Include(gm => gm.AssesseeSpResponses)
                .Include(gm => gm.AssessorSpResponses)
                .Include(gm => gm.AuthorOfComments)
                .Include(gm => gm.RecipientOfComments)
                .Include(gm => gm.RecipientOfComments.Select(roc => roc.Flag))
                .ToListAsync();

            svrWg.GroupMembers = groupMembers;

            var facResults = await _repo.GetFacSpResult(StudentPerson.PersonId, wgId);

            var spResult = new SpResult
            {
                CourseId = svrWg.CourseId,
                WorkGroupId = wgId,
                StudentId = StudentPerson.PersonId,
                AssignedInstrumentId = svrWg.AssignedSpInstrId,
                MpAssessResult = pubResult.MpAssessResult,
                CompositeScore = pubResult.CompositeScore,
                BreakOut = pubResult.BreakOut,
                WorkGroup = svrWg,
                FacultyResponses = facResults?.FacResponses,
                SanitizedResponses = svrWg.SpResponses
                    .Where(response => response.AssesseePersonId == StudentPerson.PersonId)
                    .Where(response => !response.Assessor.IsDeleted)
                    .Select(response => new SanitizedSpResponse
                    {
                        StudentId = StudentPerson.PersonId,
                        AssessorId = 0,
                        AssesseeId = StudentPerson.PersonId,
                        CourseId = svrWg.CourseId,
                        WorkGroupId = svrWg.Id,
                        IsSelfResponse = response.AssessorPersonId == StudentPerson.PersonId,
                        MpItemResponse = response.MpItemResponse,
                        ItemModelScore = response.ItemModelScore,
                        InventoryItemId = response.InventoryItemId
                    }).ToList(),
                SanitizedComments = svrWg.SpComments.Where(
                    comment =>
                        comment.RecipientPersonId == StudentPerson.PersonId &&
                        !comment.Author.IsDeleted &&
                        comment.Flag != null &&
                        comment.Flag.MpFaculty == MpCommentFlag.Appr)
                    .Select(comment => new SanitizedSpComment
                    {
                        RecipientId = comment.RecipientPersonId,
                        AuthorId = 0,
                        CourseId = svrWg.CourseId,
                        WorkGroupId = svrWg.Id,
                        AuthorName =
                            (comment.RequestAnonymity)
                                ? "Anonymous"
                                : $"{comment.Author.StudentProfile.Person.FirstName} {comment.Author.StudentProfile.Person.LastName}",
                        CommentText = comment.CommentText,
                    }).ToList()
            };

            var i = 1;
            foreach (var response in spResult.SanitizedResponses)
            {
                response.AssessorId = i;
                i += 13;
            }

            i = 1;
            foreach (var comment in spResult.SanitizedComments)
            {
                comment.AuthorId = i;
                i += 21;
            }

            if (facResults.FacSpComments != null) {
                var comment = facResults.FacSpComments.FirstOrDefault();
                spResult.SanitizedComments.Add(new SanitizedSpComment
                {
                    RecipientId = comment.RecipientPersonId,
                    AuthorId = 0,
                    CourseId = svrWg.CourseId,
                    WorkGroupId = svrWg.Id,
                    AuthorName = "Instructor",
                    CommentText = comment.CommentText
                });
            }
            
            return spResult;
        }

        public string GetMetadata => _repo.GetMetadata;

    }
}
