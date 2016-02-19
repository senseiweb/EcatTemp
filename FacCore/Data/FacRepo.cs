using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Model;
using FacCore.Interface;

namespace FacCore.Data
{
    public class FacRepo : IFacRepo
    {
        private readonly FacCtx _ctx;
        private readonly EFContextProvider<FacCtx> _efCtx;

        public FacRepo(FacCtx ctx, EFContextProvider<FacCtx> efCtx)
        {
            _ctx = ctx;
            _efCtx = efCtx;
        }

        public string Metadata => _efCtx.Metadata();

        public IQueryable<MemberInCourse> GetCrseMembership =>
         _ctx.MemberInCourses
             .Where(cm => !cm.IsDeleted)
             .OrderByDescending(crseMem => crseMem.Course.StartDate)
             .Include(c => c.Course);

        public IQueryable<MemberInGroup> GetAllWorkGroupData =>
            _efCtx.Context.MemberInGroups
                .Where(gm => !gm.IsDeleted)
                .Include(g => g.Group)
                .Include(g => g.Group.FacSpResponses)
                .Include(g => g.Group.FacSpComments)
                .Include(g => g.Group.FacStratResponses)
                .Include(g => g.Group.GroupMembers)
                .Include(gm => gm.Group.GroupMembers.Select(g => g.AssessorSpResponses))
                .Include(gm => gm.Group.GroupMembers.Select(g => g.AssessorStratResponse))
                .Include(gm => gm.Group.GroupMembers.Select(g => g.AuthorOfComments));

    }
}
