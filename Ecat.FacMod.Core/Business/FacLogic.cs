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
using Ecat.Shared.Core.ModelLibrary.Designer;
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

        async Task<List<Course>> IFacLogic.GetActiveCourse(int? courseId)
        {
            var query = courseId == null
                ? _repo.GetCourses
                : _repo.GetCourses.Where(course => course.Id == courseId);

            var coursesProj = await (from course in query
                where course.Faculty.Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId && !fac.IsDeleted)
                select new
                {
                    course,
                    FacultyCourses = course.Faculty.Where(fic => fic.FacultyPersonId == FacultyPerson.PersonId),
                }).ToListAsync();

            if (coursesProj == null) return null;

            var courses = coursesProj.OrderByDescending(c => c.course.StartDate).Select(c => c.course).ToList();

            var latestCourse = courses.First();

            var wgProj = await (from wg in _repo.GetCourseWorkGroups
                let inventoryCount = wg.AssignedSpInstr.InventoryCollection.Count
                let activeGroupCount = wg.GroupMembers.Count(gm => !gm.IsDeleted)
                where wg.CourseId == latestCourse.Id && wg.GroupMembers.Any()
                select new
                {
                    wg,
                    CanPublish = wg.GroupMembers.All(
                            gm =>
                                gm.AssessorSpResponses.Count(assess => !assess.Assessor.IsDeleted) ==
                                inventoryCount*activeGroupCount &&
                                gm.AssessorStratResponse.Count(strat => !strat.Assessor.IsDeleted) == activeGroupCount)
                }).ToListAsync();

            latestCourse.WorkGroups = new List<WorkGroup>();

            foreach (var wgp in wgProj)
            {
                var workGroup = wgp.wg;
                workGroup.CanPublish = wgp.CanPublish;
                latestCourse.WorkGroups.Add(workGroup);
            }

            return courses;
        }

        async Task<WorkGroup> IFacLogic.GetActiveWorkGroup(int courseId, int workGroupId)
        {
            var requestedWg = await (from wg in _repo.GetCourseWorkGroups
                               let inventoryCount = wg.AssignedSpInstr.InventoryCollection.Count
                               let activeGroupCount = wg.GroupMembers.Count(gm => !gm.IsDeleted)
                               where wg.WorkGroupId == workGroupId &&
                      wg.CourseId == courseId &&
                      wg.Course.Faculty.Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId)
                select new
                {
                    ActiveWg = wg,
                    CanPublish = wg.GroupMembers.All(
                            gm =>
                                gm.AssessorSpResponses.Count(assess => !assess.Assessor.IsDeleted) ==
                                inventoryCount * activeGroupCount &&
                                gm.AssessorStratResponse.Count(strat => !strat.Assessor.IsDeleted) == activeGroupCount),
                    GroupMembers = wg.GroupMembers.Where(gm => !gm.IsDeleted).Select(gm => new
                    {
                        gm,
                        SpRepsonses = gm.AssessorSpResponses.Where(aos => !aos.Assessee.IsDeleted),
                        CommentCount = gm.AuthorOfComments.Count(aos => !aos.Recipient.IsDeleted),
                        FacComment = wg.FacSpComments.FirstOrDefault(fc => fc.RecipientPersonId == gm.StudentId),
                        FacFlag = wg.FacSpComments.FirstOrDefault(fc => fc.RecipientPersonId == gm.StudentId).Flag,
                        FacResponse = wg.FacSpResponses.Where(fr =>fr.AssesseePersonId == gm.StudentId),
                        FacStrats = wg.FacStratResponses.FirstOrDefault(fs => fs.AssesseePersonId == gm.StudentId),
                        StudProfile = gm.StudentProfile,
                        StudPerson = gm.StudentProfile.Person,
                        MissingStratCount = wg.GroupMembers.Count(
                            peer => peer.AssesseeStratResponse.Count(strat => strat.AssessorPersonId == gm.StudentId) == 0)
                    })
                }).SingleAsync();

            var workGroup = requestedWg.ActiveWg;

            foreach (var grpMem in workGroup.GroupMembers)
            {
                var studInGroup = requestedWg.GroupMembers.Single(gm => gm.gm.StudentId == grpMem.StudentId);
                grpMem.NumOfStratIncomplete = studInGroup.MissingStratCount;
                grpMem.NumberOfAuthorComments = studInGroup.CommentCount;
            }
            workGroup.CanPublish = requestedWg.CanPublish;
            return workGroup;
        }

        async Task<SpInstrument> IFacLogic.GetSpInstrument(int instrumentId)
        {
            var instrument = await _repo.GetSpInstrument
                .Where(instr => instr.Id == instrumentId)
                .Select(instr => new
                {
                    instr,
                    inventory = instr.InventoryCollection.Where(collection => collection.IsDisplayed)
                }).SingleAsync();

            return instrument.instr;
        }

        async Task<List<StudSpComment>> IFacLogic.GetStudSpComments(int courseId, int workGroupId)
        {
            var comments = _repo.GetCourseWorkGroups
                .Where(wg => wg.CourseId == courseId && wg.WorkGroupId == workGroupId)
                .SelectMany(wg => wg.SpComments)
                .Include(comment => comment.Flag);

            return  await comments.Where(comment => !comment.Author.IsDeleted || !comment.Recipient.IsDeleted).ToListAsync();
        }

        async Task<List<FacSpComment>> IFacLogic.GetFacSpComment(int courseId, int workGroupId)
        {
            var comments = _repo.GetCourseWorkGroups
                .Where(wg => wg.CourseId == courseId && wg.WorkGroupId == workGroupId)
                .SelectMany(wg => wg.FacSpComments)
                .Include(comment => comment.Flag)
                .Include(comment => comment.FacultyCourse.FacultyProfile.Person)
                .Include(comment => comment.FacultyCourse.FacultyProfile);

            return await comments.Where(comment => !comment.Recipient.IsDeleted).ToListAsync();
        }

        async Task<WorkGroup> IFacLogic.GetSpResult(int courseId, int workGroupId)
        {
            var requestedWg = await (from wg in _repo.GetCourseWorkGroups
                let inventoryCount = wg.AssignedSpInstr.InventoryCollection.Count
                let activeGroupCount = wg.GroupMembers.Count(gm => !gm.IsDeleted)
                where wg.WorkGroupId == workGroupId &&
                      wg.CourseId == courseId &&
                      wg.Course.Faculty.Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId)
                select new
                {
                    ActiveWg = wg,
                    CanPublish = wg.GroupMembers.All(
                        gm =>
                            gm.AssessorSpResponses.Count(assess => !assess.Assessor.IsDeleted) ==
                            inventoryCount*activeGroupCount &&
                            gm.AssessorStratResponse.Count(strat => !strat.Assessor.IsDeleted) == activeGroupCount),
                    GroupMembers = wg.GroupMembers.Where(gm => !gm.IsDeleted).Select(gm => new
                    {
                        gm,
                        StratResult = wg.SpStratResults.FirstOrDefault(sr => sr.StudentId == gm.StudentId),
                        SpResult = wg.SpResults.FirstOrDefault(sr => sr.StudentId == gm.StudentId),
                        Strats = gm.AssesseeStratResponse.Where(asr => !asr.Assessor.IsDeleted),
                        SpRepsonses = gm.AssessorSpResponses.Where(aos => !aos.Assessee.IsDeleted),
                        FacFacultyPerson =
                            wg.FacSpComments.Select(comment => comment.FacultyCourse.FacultyProfile.Person),
                        FacFacultyProfile =
                            wg.FacSpComments.Select(comment => comment.FacultyCourse.FacultyProfile),
                        FacComment = wg.FacSpComments.FirstOrDefault(fc => fc.RecipientPersonId == gm.StudentId),
                        FacFlag = wg.FacSpComments.FirstOrDefault(fc => fc.RecipientPersonId == gm.StudentId).Flag,
                        FacResponse = wg.FacSpResponses.Where(fr => fr.AssesseePersonId == gm.StudentId),
                        FacStrats = wg.FacStratResponses.FirstOrDefault(fs => fs.AssesseePersonId == gm.StudentId),
                        StudProfile = gm.StudentProfile,
                        StudPerson = gm.StudentProfile.Person
                    })
                }).SingleAsync();

            var workGroup = requestedWg.ActiveWg;
            workGroup.CanPublish = requestedWg.CanPublish;
            return workGroup;
        }
    }
}
