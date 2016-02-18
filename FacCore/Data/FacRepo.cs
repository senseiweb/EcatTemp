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
    }
}
