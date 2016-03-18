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

        public IQueryable<CrseStudentInGroup> GetInitalCourses()
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
                    GroupMembers = gm,
                    Instrument = latestGrp.AssignedSpInstr,
                    Inventories = latestGrp.AssignedSpInstr.InventoryCollection,
                    MyAssesses =
                        gm.SelectMany(g => g.AssessorSpResponses)
                            .Where(g => g.AssessorPersonId == StudentPerson.PersonId),
                    MyStrats =
                        gm.SelectMany(g => g.AssessorStratResponse)
                            .Where(g => g.AssessorPersonId == StudentPerson.PersonId),
                    MyComments =
                        gm.SelectMany(g => g.AuthorOfComments).Where(g => g.AuthorPersonId == StudentPerson.PersonId)
                }).ToList();


            var groupMembers = studentCourseInit.Select(csig => new CrseStudentInGroup
            {
                StudentId = csig.StudentId,
                CourseId = csig.Course.Id,
                WorkGroupId = csig.WorkGroupId,
                Course = csig.Course,
                WorkGroup = csig.WorkGroup,
            }).ToList();

            var latestGrpId = studentCourseInit.FirstOrDefault()?.LatestGrpId;
            var latestWorkgroup = groupMembers.Single(gm => gm.WorkGroupId == latestGrpId).WorkGroup;
            latestWorkgroup.GroupMembers = studentCourseInit.SelectMany(g => g.GroupMembers).ToList();
            latestWorkgroup.SpComments = studentCourseInit.SelectMany(sp => sp.MyComments).ToList();
            latestWorkgroup.SpResponses = studentCourseInit.SelectMany(sp => sp.MyAssesses).ToList();
            latestWorkgroup.SpStratResponses = studentCourseInit.SelectMany(sp => sp.MyStrats).ToList();
            latestWorkgroup.AssignedSpInstr = studentCourseInit.First().Instrument;
            latestWorkgroup.AssignedSpInstr.InventoryCollection = studentCourseInit.First().Inventories.ToList();
          
            return groupMembers.AsQueryable();
        }

        public IQueryable<StudentInCourse> GetSingleCourse()
        {
            throw new NotImplementedException();
        }


        //private IQueryable<WorkGroup> GetSingleWrkGrp(int groupId)
        //{
        //    var completeWorkgroup =  _repo.WorkGroups(false)
        //        .Where(wg=> wg.Id == groupId)
        //        .Include(gm => gm.GroupMembers)
        //        .Include()
        //}

        public IQueryable<CrseStudentInGroup> GetSingleWrkGrpMembers()
        {

            return _repo.CrseStudentInGroups
                .Where(
                    gm => gm.AssessorSpResponses.Any(assessor => assessor.AssessorPersonId == StudentPerson.PersonId) ||
                          gm.AuthorOfComments.Any(aoc => aoc.AuthorPersonId == StudentPerson.PersonId) ||
                          gm.AssessorStratResponse.Any(aos => aos.AssessorPersonId == StudentPerson.PersonId))
                .Include(gm => gm.AssessorSpResponses)
                .Include(gm => gm.WorkGroup.AssignedSpInstr)
                .Include(gm => gm.WorkGroup.AssignedSpInstr.InventoryCollection)
                .Include(gm => gm.AssessorStratResponse)
                .Include(gm => gm.AuthorOfComments)
                .Include(gm => gm.AuthorOfComments.Select(f => f.Flag))
                .Include(gm => gm.AssessorSpResponses)
                .Include(gm => gm.AssesseeSpResponses.Select(stud => stud.Assessee.StudentProfile.Person))
                .Include(gm => gm.AssesseeSpResponses.Select(stud => stud.Assessee.StudentProfile));
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
            return spResult;
        }

        public string GetMetadata => _repo.GetMetadata;

    }
}
