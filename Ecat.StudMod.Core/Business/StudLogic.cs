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
            

            var requestedCourses = studCourseInit.Select(sic => sic.crse).ToList();

            //foreach (var sci in studCourseInit)
            //{
            //    var course = sci.crse;
            //    course.WorkGroups = sci.workGroups.ToList();
            //    course.StudentsInCourse = sci.StudentCoures.ToList();
            //    requestedCourses.Add(course);
            //}

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
            if (addInstrument) return requestedWorkGroup;

            requestedWorkGroup.AssignedSpInstr.InventoryCollection = null;
            requestedWorkGroup.AssignedSpInstr = null;
          
            return requestedWorkGroup;
        }

        async Task<SpResult> IStudLogic.GetWrkGrpResult(int wgId, bool addInstrument)
        {
            var myResult = await (from result in _repo.SpResult
                where result.WorkGroup.MpSpStatus == MpSpStatus.Published &&
                      result.StudentId == StudentPerson.PersonId &&
                      result.WorkGroupId == wgId
                let prundedGm = result.WorkGroup.GroupMembers.Where(gm => !gm.IsDeleted)
                let myPrunded = prundedGm.FirstOrDefault(gm => gm.StudentId == StudentPerson.PersonId)
                select new
                {
                    result,
                    result.CourseId,
                    result.WorkGroup,
                    result.WorkGroup.AssignedSpInstr,
                    result.WorkGroup.AssignedSpInstr.InventoryCollection,
                    prundedGm,
                    Profiles = prundedGm.Select(gm => gm.StudentProfile).Distinct(),
                    Persons = prundedGm.Select(gm => gm.StudentProfile.Person).Distinct(),
                    SpAssessorResponses = myPrunded.AssessorSpResponses,
                    SpAssesseeResponses = myPrunded.AssesseeSpResponses,
                    SpStratResponse = myPrunded.AssessorStratResponse,
                    AuthorComments = myPrunded.AuthorOfComments,
                    RecipientComments = myPrunded.RecipientOfComments,
                    AuthorFlags = myPrunded.AuthorOfComments.Select(aoc => aoc.Flag),
                    RecipientFlags = myPrunded.RecipientOfComments.Select(aoc => aoc.Flag)
                }).SingleOrDefaultAsync();

            if (myResult == null) return null;

            var requestedResult = myResult.result;

            requestedResult.WorkGroup.SpResponses =
                requestedResult.WorkGroup.SpResponses.Where(
                    response => response.AssessorPersonId == StudentPerson.PersonId).ToList();

            requestedResult.WorkGroup.SpStratResponses =
              requestedResult.WorkGroup.SpStratResponses.Where(
                  response => response.AssessorPersonId == StudentPerson.PersonId).ToList();


            if (addInstrument)
            {
                requestedResult.AssignedInstrument.InventoryCollection = null;
                requestedResult.AssignedInstrument = null;
            }

            var facResultData = await _repo.GetFacSpResult(StudentPerson.PersonId, wgId);

            requestedResult.SanitizedResponses = myResult.SpAssesseeResponses.Select(ar => new SanitizedSpResponse
            {
                //StudentId = StudentPerson.PersonId,
                Id = Guid.NewGuid(),
                AssesseeId = StudentPerson.PersonId,
                CourseId = myResult.WorkGroup.CourseId,
                WorkGroupId = myResult.WorkGroup.Id,
                IsSelfResponse = ar.AssessorPersonId == StudentPerson.PersonId,
                MpItemResponse = ar.MpItemResponse,
                ItemModelScore = ar.ItemModelScore,
                InventoryItemId = ar.InventoryItemId,
                Result = requestedResult
            }).ToList();

            requestedResult.SanitizedComments = myResult.RecipientComments.Select(rc => new SanitizedSpComment
            {
                RecipientId = rc.RecipientPersonId,
                Id = Guid.NewGuid(),
                CourseId = rc.CourseId,
                WorkGroupId = rc.WorkGroupId,
                AuthorName =
                            (rc.RequestAnonymity)
                                ? "Anonymous"
                                : $"{rc.Author.StudentProfile.Person.FirstName} {rc.Author.StudentProfile.Person.LastName}",
                CommentText = rc.CommentText,
                Flag = myResult.RecipientFlags.Single(flag => flag.AuthorPersonId == rc.AuthorPersonId && flag.RecipientPersonId == rc.RecipientPersonId)
            }).ToList();

            foreach (var flag in requestedResult.SanitizedComments.Select(sc =>sc.Flag))
            {
                flag.AuthorPersonId = flag.AuthorPersonId == StudentPerson.PersonId
                    ? flag.AuthorPersonId
                    : flag.AuthorPersonId*13;
            }

            requestedResult.FacultyResponses = facResultData.FacResponses.ToList();

            if (!requestedResult.FacultyResponses.Any()) return requestedResult;

            if (facResultData.FacSpComment != null)
            {
                requestedResult.SanitizedComments.Add(new SanitizedSpComment
                {
                    Id = Guid.NewGuid(),
                    RecipientId = facResultData.FacSpComment.RecipientPersonId,
                    CourseId = myResult.CourseId,
                    WorkGroupId = myResult.WorkGroup.Id,
                    AuthorName = "Instructor",
                    CommentText = facResultData.FacSpComment.CommentText,
                    FacFlag = facResultData.FacSpCommentFlag
                });
            }

            return requestedResult;
        }

        public string GetMetadata => _repo.GetMetadata;

    }
}
