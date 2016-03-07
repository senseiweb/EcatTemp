using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.FacMod.Core
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

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
            var neededSaveGuards = new List<Guard>();

            if (FacultyPerson.MpInstituteRole != MpInstituteRoleName.HqAdmin)
            {
                //var userGuard = new GuardUserSave(User);
                //neededSaveGuards.Add(userGuard.BeforeSaveEntities);
            }

            return _repo.ClientSaveChanges(saveBundle, neededSaveGuards);
        }

        public string GetMetadata => _repo.Metadata;

        IQueryable<FacultyInCourse> IFacLogic.GetActiveCourseData(int courseId)
        {
            return _repo.GetFacultyCourses
                .Where(fc => fc.FacultyPersonId == FacultyPerson.PersonId && fc.FacultyProfile.Person.IsActive)
                .Where(fc => fc.CourseId == courseId)
                .Include(fc => fc.Course.WorkGroups);
        }

        IQueryable<CrseStudentInGroup> IFacLogic.GetWorkGroupSpData(int courseId, int workGroupId, bool addAssessment)
        {
            var groupMembers = _repo.GetWorkGroupMembers(addAssessment)
                .Where(gm => gm.WorkGroup.Course.Faculty
                    .Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId && fac.FacultyProfile.Person.IsActive))
                .Where(gm => gm.CourseId == courseId && gm.WorkGroupId == workGroupId)
                .Include(fc => fc.Course.WorkGroups)
                .Include(gm => gm.WorkGroup)
                .Include(gm => gm.WorkGroup.GroupMembers)
                .Include(gm => gm.WorkGroup.FacSpComments)
                .Include(gm => gm.WorkGroup.FacSpResponses)
                .Include(gm => gm.WorkGroup.FacStratResponses)
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentInCourse.Student))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentInCourse.Student.Person))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.AssessorSpResponses))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.AssessorStratResponse));

            var groupMembersId = groupMembers.Select(gm => gm.StudentId).ToList();

            var commentCount = _repo.AuthorCommentCounts(groupMembersId, workGroupId).ToList();

            foreach (var cc in commentCount)
            {
                var member = groupMembers.Single(gm => gm.StudentId == cc.AuthorId);
                member.NumberOfAuthorComments = cc.NumOfComments;
            }

            return groupMembers.AsQueryable();
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

            _repo.AddCourseWorkgroups(latestCourse);

            var crseWgNotPublish =
                latestCourse.WorkGroups.Where(wg => wg.MpSpStatus == MpSpStatus.Open).Select(wg => wg.Id);

            var grpIdsReadyForPublish = _repo.CanWgPublish(crseWgNotPublish.ToList());

            foreach (var wg in grpIdsReadyForPublish.Select(grpId => latestCourse.WorkGroups.Single(grp => grp.Id == grpId)))
            {
                wg.CanPublish = true;
            }
            
            return facCrses.AsQueryable();
        }

        IQueryable<SpComment> IFacLogic.GetSpComments()
        {
            return _repo.WgComments
                .Where(comment => comment.WorkGroup
                    .Course
                    .Faculty
                    .Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId));
        }
    }
}
