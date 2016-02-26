using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.FacFunc.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.DbMgr.Context;
using Newtonsoft.Json.Linq;

namespace Ecat.FacFunc.Core.Data
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

        public SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards)
        {
            if (!saveGuards.Any()) return _efCtx.SaveChanges(saveBundle);

            foreach (var saveGuard in saveGuards)
            {
                _efCtx.BeforeSaveEntitiesDelegate += saveGuard;
            }

            return _efCtx.SaveChanges(saveBundle);
        }


        public string Metadata => _efCtx.Metadata();

        public IQueryable<FacultyInCourse> GetFacultyCourses => _ctx.FacultyInCourses
            .Where(fc => !fc.IsDeleted)
            .OrderByDescending(fc => fc.Course.StartDate)
            .Include(fc => fc.Course);


        IQueryable<CrseStudentInGroup> IFacRepo.GetAllWorkGroupData =>
            _ctx.StudentInGroups
                .Where(gm => !gm.IsDeleted)
                .Include(g => g.WorkGroup)
                .Include(g => g.WorkGroup.FacSpResponses)
                .Include(g => g.WorkGroup.FacSpComments)
                .Include(g => g.WorkGroup.FacStratResponses)
                .Include(g => g.WorkGroup.GroupMembers)
                .Include(gm => gm.WorkGroup.GroupMembers.Select(g => g.AssessorSpResponses))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(g => g.AssessorStratResponse))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(g => g.AuthorOfComments));
    }

}
