using System.Data.Entity;
using System.Linq;
using Breeze.ContextProvider.EF6;
using Ecat.Fac.Core.Interface;
using Ecat.Shared.DbManager.Context;
using Ecat.Shared.Model;

namespace Ecat.Fac.Core.Data
{
    public class FacRepo : IFacRepo
    {
        private readonly EcatContext _ctx;
        private readonly EFContextProvider<FacCtx> _efCtx;

        public FacRepo(EcatContext ctx, EFContextProvider<FacCtx> efCtx)
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
            _ctx.MemberInGroups
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
