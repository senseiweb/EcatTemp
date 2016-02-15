using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Model;
using Ecat.Student.Core.Interface;

namespace Ecat.Student.Core.Data
{
    public class StudRepo : IStudRepo
    {
        private readonly StudCtx _ctx;
        private readonly EFContextProvider<StudCtx> _efCtx;

        public StudRepo(EFContextProvider<StudCtx> efCtx, StudCtx ctx )
        {
            _efCtx = efCtx;
            _ctx = ctx;
        }

        public string GetMetadata => _efCtx.Metadata();

        public IQueryable<MemberInCourse> GetCrseMembershipWithCourse(int crseMemId)
        {
            return null;
        }

        public IQueryable<MemberInGroup> GetGrpMembershipsWithGroups(int crseMemId)
        {
            return _ctx.MemberInGroups
                .Where(gm => gm.CourseEnrollmentId == crseMemId)
                .Include(gm => gm.Group);
        }

       
    }
}
