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

            var rand = new Random();

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
                    .Select((response, index) => new SanitizedSpResponse
                    {
                        StudentId = StudentPerson.PersonId,
                        AssessorId = index,
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
                        comment.Flag.MpFacultyFlag == MpCommentFlag.Appr)
                    .Select((comment, index) => new SanitizedSpComment
                    {
                        RecipientId = comment.RecipientPersonId,
                        AuthorId = index,
                        CourseId = svrWg.CourseId,
                        WorkGroupId = svrWg.Id,
                        AuthorName =
                            (comment.RequestAnonymity)
                                ? "Anonymous"
                                : $"{comment.Author.StudentProfile.Person.FirstName} {comment.Author.StudentProfile.Person.LastName}",
                        CommentText = comment.CommentText,
                    }).ToList()
            };

            return spResult;
        }

        public string GetMetadata => _repo.GetMetadata;

    }
}
