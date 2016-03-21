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
            var query = crseId != null ? _repo.Courses.Where(c => c.Id == crseId) : _repo.Courses;

            var studCourseInit = await (from crse in query
                where crse.StudentsInCourse.Any(sic => sic.StudentPersonId == StudentPerson.PersonId && !sic.IsDeleted)
                select new
                {
                    crse,
                    workGroups = crse.WorkGroups.Where(wg => wg.GroupMembers.Any(gm => gm.StudentId == StudentPerson.PersonId)),
                    StudentCoures = crse.StudentsInCourse
                        .Where(sic => sic.StudentPersonId == StudentPerson.PersonId),
                }).ToListAsync();
            

            var requestedCourses = new List<Course>();

            foreach (var sci in studCourseInit)
            {
                var course = sci.crse;
                if (requestedCourses.Contains(course)) continue;
                course.WorkGroups = sci.workGroups.ToList();
                course.StudentsInCourse = sci.StudentCoures.ToList();
                requestedCourses.Add(course);
            }

            var activeCourse = requestedCourses.OrderByDescending(crse => crse.StartDate).First();
            var activeGroup = activeCourse.WorkGroups.OrderByDescending(wg => wg.MpCategory).FirstOrDefault();
            if (crseId != null) requestedCourses = requestedCourses.Where(crse => crse.Id == crseId).ToList();

            if (activeGroup == null) return requestedCourses;

            activeGroup = await GetWorkGroup(activeGroup.Id, false);
            activeCourse.WorkGroups.Add(activeGroup);
            return requestedCourses;
        }

        public async Task<WorkGroup> GetWorkGroup(int wgId, bool addInstrument)
        {
            var workGroup = await (from wg in _repo.WorkGroups
                where wg.Id == wgId &&
                      wg.GroupMembers.Any(gm => gm.StudentId == StudentPerson.PersonId && !gm.IsDeleted)
                let prundedGm = wg.GroupMembers.Where(gm => !gm.IsDeleted)
                let myPrunded = prundedGm.FirstOrDefault(gm => gm.StudentId == StudentPerson.PersonId)
                select new
                {
                    wg,
                    wg.AssignedSpInstr,
                    wg.AssignedSpInstr.InventoryCollection,
                    PrunedGroupMembers = prundedGm,
                    myPrunded.AssessorSpResponses,
                    myPrunded.AssessorStratResponse,
                    myPrunded.AuthorOfComments,
                    Flags = myPrunded.AuthorOfComments.Select(aoc => aoc.Flag),
                    Profiles = prundedGm.Select(gm => gm.StudentProfile).Distinct(),
                    Persons = prundedGm.Select(gm => gm.StudentProfile.Person).Distinct()
                }).SingleOrDefaultAsync();
            
            var requestedWorkGroup = workGroup.wg;
            if (addInstrument)
            {
                requestedWorkGroup.AssignedSpInstr = workGroup.wg.AssignedSpInstr;
                requestedWorkGroup.AssignedSpInstr.InventoryCollection =
                    workGroup.wg.AssignedSpInstr.InventoryCollection;
            }
            requestedWorkGroup.GroupMembers = workGroup.PrunedGroupMembers.ToList();
            requestedWorkGroup.SpResponses = workGroup.AssessorSpResponses.ToList();
            requestedWorkGroup.SpStratResponses = workGroup.AssessorStratResponse.ToList();
            requestedWorkGroup.SpComments = workGroup.AuthorOfComments.ToList();

            foreach (var comment in requestedWorkGroup.SpComments)
            {
                comment.Flag = workGroup.Flags.First(c => c.AuthorPersonId == comment.AuthorPersonId && 
                c.RecipientPersonId == comment.RecipientPersonId);
            }

            return requestedWorkGroup;
        }

        async Task<SpResult> IStudLogic.GetWrkGrpResult(int wgId, bool addInstrument)
        {
            var myResult = await (from result in _repo.SpResult
                where result.WorkGroup.MpSpStatus == MpSpStatus.Published &&
                      result.WorkGroup.GroupMembers.Any(gm => gm.StudentId == StudentPerson.PersonId) &&
                      result.WorkGroupId == wgId

                from facSpResponse in _repo.WorkGroups.Where(wg => wg.Id == wgId).Select(fac => fac.FacSpResponses)
                where facSpResponse.Any(fr => fr.AssesseePersonId == StudentPerson.PersonId)

                from facComment in _repo.WorkGroups.FirstOrDefault(wg => wg.Id == wgId).FacSpComments
                where facComment.RecipientPersonId == StudentPerson.PersonId

                let prundedGm = result.WorkGroup.GroupMembers.Where(gm => !gm.IsDeleted)
                let myPrunded = prundedGm.FirstOrDefault(gm => gm.StudentId == StudentPerson.PersonId)
                select new
                {
                    result,
                    result.CourseId,
                    result.WorkGroup,
                    result.WorkGroup.AssignedSpInstr,
                    result.WorkGroup.AssignedSpInstr.InventoryCollection,
                    result.WorkGroup.GroupMembers,
                    SpAssessorGmProfiles =
                        myPrunded.AssessorSpResponses.Select(p => p.Assessee.StudentProfile),
                    SpAssessorGmPerson =
                        myPrunded.AssessorSpResponses.Select(p => p.Assessee.StudentProfile.Person),
                    SpAssessorResponses = myPrunded.AssessorSpResponses,
                    SpAssesseeResponses = myPrunded.AssesseeSpResponses,
                    SpStratResponse = myPrunded.AssessorStratResponse,
                    AuthorComments = myPrunded.AuthorOfComments,
                    RecipientComments = myPrunded.RecipientOfComments,
                    facSpResponse,
                    facComment,
                    facComment.Flag,
                    AuthorFlags = myPrunded.AuthorOfComments.Select(aoc => aoc.Flag),
                    RecipientFlags = myPrunded.AuthorOfComments.Select(aoc => aoc.Flag)
                }).SingleOrDefaultAsync();

            var requestedResult = myResult.result;

            if (addInstrument)
            {
                requestedResult.AssignedInstrument = myResult.result.WorkGroup.AssignedSpInstr;
                requestedResult.AssignedInstrument.InventoryCollection =
                    myResult.result.WorkGroup.AssignedSpInstr.InventoryCollection;
            }

            requestedResult.WorkGroup = myResult.WorkGroup;
            requestedResult.WorkGroup.GroupMembers = myResult.WorkGroup.GroupMembers;
            requestedResult.WorkGroup.SpComments = myResult.AuthorComments;
            requestedResult.WorkGroup.SpResponses = myResult.SpAssessorResponses;
            requestedResult.WorkGroup.SpStratResponses = myResult.SpStratResponse;

            foreach (var comment in requestedResult.WorkGroup.SpComments)
            {
                comment.Flag =
                    myResult.AuthorFlags.SingleOrDefault(
                        flag =>
                            flag.CourseId == comment.CourseId && flag.AuthorPersonId == comment.AuthorPersonId &&
                            flag.RecipientPersonId == comment.RecipientPersonId);
            }

            requestedResult.SanitizedResponses = myResult.SpAssesseeResponses.Select(ar => new SanitizedSpResponse
            {
                StudentId = StudentPerson.PersonId,
                AssessorId = ar.AssessorPersonId == StudentPerson.PersonId ? ar.AssessorPersonId : ar.AssessorPersonId * 6,
                AssesseeId = StudentPerson.PersonId,
                CourseId = ar.CourseId,
                WorkGroupId = ar.WorkGroupId,
                IsSelfResponse = ar.AssessorPersonId == StudentPerson.PersonId,
                MpItemResponse = ar.MpItemResponse,
                ItemModelScore = ar.ItemModelScore,
                InventoryItemId = ar.InventoryItemId
            }).ToList();

            requestedResult.SanitizedComments = myResult.RecipientComments.Select(rc => new SanitizedSpComment
            {
                RecipientId = rc.RecipientPersonId,
                AuthorId = rc.AuthorPersonId == StudentPerson.PersonId ? rc.AuthorPersonId : rc.AuthorPersonId * 13,
                CourseId = rc.CourseId,
                WorkGroupId = rc.WorkGroupId,
                AuthorName =
                            (rc.RequestAnonymity)
                                ? "Anonymous"
                                : $"{rc.Author.StudentProfile.Person.FirstName} {rc.Author.StudentProfile.Person.LastName}",
                CommentText = rc.CommentText,
                Flag = myResult.RecipientFlags.SingleOrDefault(flag => flag.AuthorPersonId == rc.AuthorPersonId && flag.RecipientPersonId == rc.RecipientPersonId)
            }).ToList();

            foreach (var flag in requestedResult.SanitizedComments.Select(sc =>sc.Flag))
            {
                flag.AuthorPersonId = flag.AuthorPersonId == StudentPerson.PersonId
                    ? flag.AuthorPersonId
                    : flag.AuthorPersonId*13;
            }

            requestedResult.FacultyResponses = myResult.facSpResponse;

            if (myResult.facSpResponse == null) return requestedResult;


            requestedResult.SanitizedComments.Add(new SanitizedSpComment
            {
                RecipientId = myResult.facComment.RecipientPersonId,
                AuthorId = myResult.facComment.FacultyPersonId,
                CourseId = myResult.CourseId,
                WorkGroupId = myResult.WorkGroup.Id,
                AuthorName = "Instructor",
                CommentText = myResult.facComment.CommentText
            });

            return requestedResult;
        }

        public string GetMetadata => _repo.GetMetadata;

    }
}
