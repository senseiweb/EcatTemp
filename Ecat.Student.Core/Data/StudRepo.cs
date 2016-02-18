using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.DbManager.Context;
using Ecat.Shared.Model;
using Ecat.Student.Core.Interface;

namespace Ecat.Student.Core.Data
{
    public class StudRepo : IStudRepo
    {
        private readonly StudCtx _ctx;
        private readonly EcatContext _mainCtx;
        private readonly EFContextProvider<StudCtx> _efCtx;

        public StudRepo(EFContextProvider<StudCtx> efCtx, StudCtx ctx, EcatContext mainCtx)
        {
            _efCtx = efCtx;
            _ctx = ctx;
            _mainCtx = mainCtx;
        }

        public string GetMetadata => _efCtx.Metadata();

        public IQueryable<MemberInCourse> GetCrseMembership =>
            _ctx.MemberInCourses
                .Where(cm => !cm.IsDeleted)
                .OrderByDescending(crseMem => crseMem.Course.StartDate)
                .Include(c => c.Course);

        public IQueryable<MemberInGroup> GetSingleGrpMemberships => _ctx.MemberInGroups
            .Where(gm => !gm.IsDeleted)
            .OrderByDescending(grpMem => grpMem.Group.MpCategory)
            .Include(g => g.Group)
            .Include(g => g.GroupPeers.Select(p => p.Student))
            .Include(g => g.GroupPeers.Select(p => p.Student.Person))
            .Include(g => g.AssessorStratResponse)
            .Include(g => g.AssessorSpResponses)
            .Include(g => g.AuthorOfComments);

    }
}
