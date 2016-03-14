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
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

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
            var neededSaveGuards = new List<Guard>();

            if (StudentPerson.MpInstituteRole != MpInstituteRoleName.HqAdmin)
            {
                //var userGuard = new GuardUserSave(User);
                //neededSaveGuards.Add(userGuard.BeforeSaveEntities);
            }

            return _repo.ClientSaveChanges(saveBundle, neededSaveGuards);
        }

        public IQueryable<CrseStudentInGroup> GetInitalCourses()
        {
            var groups =  _repo.CrseStudentInGroups
                .Where(gm => gm.StudentId == StudentPerson.PersonId)
                .OrderByDescending(p => p.Course.StartDate)
                .Include(gm => gm.Course)
                .Include(gm => gm.WorkGroup).ToList();

            var latestGroup = groups.OrderByDescending(gm => gm.WorkGroup.MpCategory).First();

            var groupId = latestGroup.WorkGroupId;

            latestGroup = _repo.CrseStudentInGroups
                .Where(gm => gm.WorkGroupId == groupId && gm.StudentId == StudentPerson.PersonId)
                .Include(gm => gm.WorkGroup.AssignedSpInstr)
                .Include(gm => gm.WorkGroup.AssignedSpInstr.InventoryCollection)
                .Include(gm => gm.AssessorStratResponse)
                .Include(gm => gm.AssessorSpResponses)
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentInCourse.Student))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentInCourse.Student.Person))
                .Include(gm => gm.AuthorOfComments)
                .Include(gm => gm.AuthorOfComments.Select(f => f.Flag)).Single();


            return groups.AsQueryable();
        }

        public IQueryable<StudentInCourse> GetSingleCourse()
        {
            throw new NotImplementedException();
        }

        public IQueryable<CrseStudentInGroup> GetSingleWrkGrpMembers()
        {
            return _repo.CrseStudentInGroups
                .Where(gm => gm.StudentId == StudentPerson.PersonId)
                .Include(gm => gm.WorkGroup.AssignedSpInstr)
                .Include(gm => gm.WorkGroup.AssignedSpInstr.InventoryCollection)
                .Include(gm => gm.AssessorStratResponse)
                .Include(gm => gm.AuthorOfComments)
                .Include(gm => gm.AuthorOfComments.Select(f => f.Flag))
                .Include(gm => gm.AssessorSpResponses)
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentInCourse.Student))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentInCourse.Student.Person));
        }

        async Task<SpResult> IStudLogic.GetWrkGrpResult(int wgId, bool addInstrument)
        {
            var svrResult2 = await _repo.WorkGroups(addInstrument)
                .Where(wg => wg.MpSpStatus == MpSpStatus.Published)
                .Where(wg => wg.Id == wgId)
                .Where(wg => wg.GroupMembers.Any(gm => !gm.IsDeleted && gm.StudentId == StudentPerson.PersonId))
                .Select(wg => new SpResult
                {
                    CourseId = wg.CourseId,
                    WorkGroupId = wg.Id,
                    StudentId = StudentPerson.PersonId,
                    AssignedInstrumentId = wg.AssignedSpInstrId,
                    MpAssessResult =
                        wg.SpResults.First(result => result.StudentId == StudentPerson.PersonId).MpAssessResult,
                    CompositeScore =
                        wg.SpResults.First(result => result.StudentId == StudentPerson.PersonId).CompositeScore,
                    BreakOut =
                        wg.SpResults.First(result => result.StudentId == StudentPerson.PersonId).BreakOut,
                    FacultyResponses =
                        wg.FacSpResponses.Where(facRespose => facRespose.AssesseePersonId == StudentPerson.PersonId)
                            .ToList(),
                    SanitizedResponses =
                        wg.SpResponses.Where(
                            response =>
                                response.AssesseePersonId == StudentPerson.PersonId && !response.Assessor.IsDeleted)
                            .Select(response => new SanitizedSpResponse
                            {
                                CourseId = wg.CourseId,
                                WorkGroupId = wg.Id,
                                StudentId = StudentPerson.PersonId,
                                IsSelfResponse = response.AssessorPersonId == StudentPerson.PersonId,
                                MpItemResponse = response.MpItemResponse,
                                ItemModelScore = response.ItemModelScore,
                                InventoryItemId = response.InventoryItemId
                            }).ToList(),
                    SanitizedComments =
                        wg.SpComments.Where(
                            comment =>
                                comment.RecipientPersonId == StudentPerson.PersonId && !comment.Author.IsDeleted &&
                                comment.Flag.MpFacultyFlag == MpCommentFlag.Appr)
                            .Select(comment => new SanitizedSpComment
                            {
                                RecipientId = comment.RecipientPersonId,
                                CourseId = wg.CourseId,
                                WorkGroupId = wg.Id,
                                AuthorName = (comment.RequestAnonymity) ? "Anonymous" : $"{comment.Author.StudentProfile.Person.FirstName} {comment.Author.StudentProfile.Person.LastName}",
                                CommentText = comment.CommentText,
                            }).ToList()
                }).SingleOrDefaultAsync();

            if (svrResult2 == null)
            {
                return null;
            }

            var index = 0;

            foreach (var comment in svrResult2.SanitizedComments)
            {
                comment.AuthorId = index;
                index += 1;
            }

            index = 0;

            foreach (var response in svrResult2.SanitizedResponses)
            {
                response.AssessorId = index;
                index += 1;
            }

            return svrResult2;
        }

        public string GetMetadata => _repo.GetMetadata;

    }
}
