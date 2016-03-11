using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.DbMgr.Context;
using Newtonsoft.Json.Linq;

namespace Ecat.FacMod.Core
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public class FacRepo : IFacRepo
    {
        private readonly EcatContext _ctx;
        private readonly EFContextProvider<FacCtx> _efCtx;

        public FacRepo(EcatContext ctx, EFContextProvider<FacCtx> efCtx)
        {
            _ctx = ctx;
            _efCtx = efCtx;
        }

        SaveResult IFacRepo.ClientSaveChanges(JObject saveBundle)
        {
           
                _efCtx.BeforeSaveEntitiesDelegate += saveGuard;

            return _efCtx.SaveChanges(saveBundle);
        }

        string IFacRepo.Metadata => _efCtx.Metadata();

        IQueryable<FacultyInCourse> IFacRepo.GetFacultyCourses => _ctx.FacultyInCourses
            .Where(fc => !fc.IsDeleted)
            .OrderByDescending(fc => fc.Course.StartDate)
            .Include(fc => fc.Course);

        void IFacRepo.AddCourseWorkgroups(Course course)
        {
            _ctx.Entry(course).Collection(wg => wg.WorkGroups).Load();
        }

        IQueryable<CommentCount> IFacRepo.AuthorCommentCounts(List<int> authorIds, int workGroupId)
        {
            return _ctx.StudentInGroups
                .Where(sig => authorIds.Contains(sig.StudentId) && sig.WorkGroupId == workGroupId)
                .Select(sig => new CommentCount
                {
                    AuthorId = sig.StudentId,
                    NumOfComments = sig.AuthorOfComments.Count()
                });
        }

        IQueryable<WorkGroup> IFacRepo.GetCourseWorkGroups => _ctx.WorkGroups;

        IQueryable<CrseStudentInGroup> IFacRepo.GetWorkGroupMembers(bool addAssessment)
        {
            var query = _ctx.StudentInGroups.Where(sig => !sig.IsDeleted);
            return !addAssessment
                ? query
                : query.Include(g => g.WorkGroup.AssignedSpInstr)
                    .Include(g => g.WorkGroup.AssignedSpInstr.InventoryCollection);
        }

        List<int> IFacRepo.CanWgPublish(List<int> wgIds)
        {
            return _ctx.WorkGroups
                .Where(grp => wgIds.Contains(grp.Id))
                .Where(grp => grp.GroupMembers.Any() && grp.AssignedSpInstr.InventoryCollection.Any())
                .Where(grp => grp.GroupMembers.All(crseStudent =>
                    crseStudent.AssessorSpResponses.Count(r => !r.Assessee.IsDeleted) ==
                    grp.GroupMembers.Count(gm => !gm.IsDeleted)*grp.AssignedSpInstr.InventoryCollection.Count()))
                .Where(grp => grp.GroupMembers.All(crseStudent =>
                    crseStudent.AssessorStratResponse.Count(r => !r.Assessee.IsDeleted) ==
                    grp.GroupMembers.Count(gm => !gm.IsDeleted)))
                .Select(wg => wg.Id)
                .ToList();
        }

        IQueryable<StudSpComment> IFacRepo.WgComments => _ctx.StudSpComments;
    }

}
