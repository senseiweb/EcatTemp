using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.AccessControl;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.FacMod.Core
{

    public class FacLogic : IFacLogic
    {
        private readonly IFacRepo _repo;
        public Person FacultyPerson { get; set; }

        public FacLogic(IFacRepo repo)
        {
            _repo = repo;
        }

        public SaveResult ClientSave(JObject saveBundle)
        {
            return _repo.ClientSaveChanges(saveBundle, FacultyPerson);
        }

        public string GetMetadata => _repo.Metadata;

        IQueryable<FacultyInCourse> IFacLogic.GetActiveCourseData(int courseId)
        {
            return _repo.GetFacultyCourses
                .Where(fc => fc.FacultyPersonId == FacultyPerson.PersonId && fc.FacultyProfile.Person.IsActive)
                .Where(fc => fc.CourseId == courseId)
                .Include(fc => fc.Course.WorkGroups);
        }

        WorkGroup IFacLogic.GetWorkGroupSpData(int courseId, int workGroupId, bool addAssessment)
        {
            var requestedWg = (from wg in _repo.GetCourseWorkGroups
                where wg.Id == workGroupId &&
                      wg.CourseId == courseId &&
                      wg.Course.Faculty.Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId)
                select new
                {
                    ActiveWg = wg,
                    Assessment = (!addAssessment) ? null : new
                    {
                        Instrument= wg.AssignedSpInstr,
                        Inventory= wg.AssignedSpInstr.InventoryCollection
                    },
                    GroupMembers = wg.GroupMembers.Where(gm => !gm.IsDeleted).Select(gm => new
                    {
                        gm.CourseId,
                        gm.StudentId,
                        gm.WorkGroupId,
                        SpRepsonses = gm.AssessorSpResponses.Where(aos => !aos.Assessee.IsDeleted),
                        CommentCount = gm.AuthorOfComments.Count(aos => !aos.Recipient.IsDeleted),
                        FacComment = gm.FacultyComment,
                        FacResponse = gm.FacultySpResponses,
                        FacStrats = gm.FacultyStrat,
                        StudProfile = gm.StudentProfile,
                        StudPerson = gm.StudentProfile.Person,
                        MissingStratCount = wg.GroupMembers.Count(
                            peer => peer.AssesseeStratResponse.Count(strat => strat.AssessorPersonId == gm.StudentId) == 0)
                    })
                }).Single();

            var group = requestedWg.GroupMembers.Select(gm => new CrseStudentInGroup
            {
                CourseId = gm.CourseId,
                WorkGroupId = gm.WorkGroupId,
                StudentId =  gm.StudentId,
                StudentProfile = gm.StudProfile,
                NumberOfAuthorComments = gm.CommentCount,
                NumOfStratIncomplete = gm.MissingStratCount,
                FacultyComment = gm.FacComment,
                FacultySpResponses = gm.FacResponse,
                FacultyStrat = gm.FacStrats,
                AssessorSpResponses = gm.SpRepsonses.ToList()
            }).ToList();
            
            foreach (var gm in group)
            {
                gm.StudentProfile.Person = requestedWg.GroupMembers.Single(g => g.StudentId == gm.StudentId).StudPerson;
            }

            var workGroup = requestedWg.ActiveWg;
            workGroup.GroupMembers = group;

            if (!addAssessment) return workGroup;

            workGroup.AssignedSpInstr = requestedWg.Assessment.Instrument;
            workGroup.AssignedSpInstr.InventoryCollection = requestedWg.Assessment.Inventory;
            workGroup.CanPublish = _repo.CanWgPublish(new List<int> {workGroupId}).Contains(workGroupId);
            return workGroup;
        }

        IQueryable<FacultyInCourse> IFacLogic.GetCrsesWithLastestGrpMem()
        {
            var facCrses = _repo.GetFacultyCourses
                .Where(fc => fc.FacultyPersonId == FacultyPerson.PersonId && fc.FacultyProfile.Person.IsActive)
                .Include(crse => crse.Course.WorkGroups).ToList();

            if (!facCrses.Any())
            {
                return null;
            }

            var latestCourse = facCrses.Select(fc => fc.Course).First();

            //_repo.AddCourseWorkgroups(latestCourse);

            var crseWgNotPublish =
                latestCourse.WorkGroups.Where(wg => wg.MpSpStatus == MpSpStatus.Open || wg.MpSpStatus == MpSpStatus.UnderReview).Select(wg => wg.Id);

            var grpIdsReadyForPublish = _repo.CanWgPublish(crseWgNotPublish.ToList());

            foreach (var wg in grpIdsReadyForPublish.Select(grpId => latestCourse.WorkGroups.Single(grp => grp.Id == grpId)))
            {
                wg.CanPublish = true;
            }
            
            return facCrses.AsQueryable();
        }

        IQueryable<StudSpComment> IFacLogic.GetStudSpComments()
        {
            return _repo.WgComments
                .Where(comment => comment.WorkGroup
                    .Course
                    .Faculty
                    .Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId))
                    .Include(p => p.Flag);
        }

        IQueryable<CrseStudentInGroup> IFacLogic.GetWorkGroupResults(bool addAssessment, bool addComments)
        {
            return null;
            //return _repo.GetWorkGroupMembers(addAssessment, addComments)
            //    .Where(gm => gm.WorkGroup.MpSpStatus == MpSpStatus.Published)
            //    .Where(gm => !gm.IsDeleted)
            //    .Where(gm => gm.Course.Faculty.Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId))
            //    .Include(gm => gm.WorkGroup.SpResults)
            //    .Include(gm => gm.WorkGroup.SpStratResults)
            //    .Include(gm => gm.WorkGroup.FacSpResponses)
            //    .Include(gm => gm.WorkGroup.FacStratResponses)
            //    .Include(gm => gm.AssessorSpResponses)
            //    .Include(gm => gm.AssessorStratResponse)
            //    .Include(gm => gm.StudentProfile.Person);
        }

        IQueryable<Course> IFacLogic.CourseMembers(int courseId)
        {
            return _repo.CourseMembers(courseId);
        }

        //async Task<Course> IFacLogic.PollBbCourse()
        //{
        //    var faculty = await _repo.LoadFacultyProfile(FacultyPerson);

        //    throw new HttpResponseException(HttpStatusCode.Unauthorized);

        //    var catId = StaticAcademy.AcadLookup.Select(acad => acad.Key == faculty.Faculty.AcademyId)

        //}
    }
}
