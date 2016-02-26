using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.DbMgr.Context;
using Ecat.StudFunc.Core.Inteface;
using Newtonsoft.Json.Linq;

namespace Ecat.StudFunc.Core.Data
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public class StudRepo : IStudRepo
    {
        private readonly StudCtx _ctx;
        private readonly EFContextProvider<StudCtx> _efCtx;

        public StudRepo(EFContextProvider<StudCtx> efCtx, StudCtx ctx)
        {
            _efCtx = efCtx;
            _ctx = ctx;
        }

        public SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards)
        {
            if (!saveGuards.Any()) return _efCtx.SaveChanges(saveBundle);

            foreach (var saveGuard in saveGuards)
            {
                _efCtx.BeforeSaveEntitiesDelegate += saveGuard;
            }

            return _efCtx.SaveChanges(saveBundle);
        }


        public string GetMetadata => _efCtx.Metadata();

        public IQueryable<StudentInCourse> GetCrseMembership => _ctx.StudentInCourses
                .Where(cm => !cm.IsDeleted)
                .OrderByDescending(crseMem => crseMem.Course.StartDate)
                .Include(c => c.Course);

        public IQueryable<CrseStudentInGroup> SingleGroupMemberResponses => _ctx.CrseStudentInGroups
            .Where(gm => !gm.IsDeleted)
            .OrderByDescending(grpMem => grpMem.WorkGroup.MpCategory)
            .Include(g => g.WorkGroup)
            .Include(g => g.WorkGroup.AssignedSpInstr)
            .Include(g => g.WorkGroup.AssignedSpInstr.InventoryCollection)
            .Include(g => g.WorkGroup.GroupMembers.Select(p => p.StudentProfile))
            .Include(g => g.WorkGroup.GroupMembers.Select(p => p.StudentProfile.Person))
            .Include(g => g.AssessorStratResponse)
            .Include(g => g.AssessorSpResponses)
            .Include(g => g.AuthorOfComments);
    }
}
