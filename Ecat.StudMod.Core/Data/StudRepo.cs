using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
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

        public CrseStudentInGroup FindStudInGrpById(int studentId, int courseId, int workGroupId)
        {
            return _ctx.StudentInGroups.Find(studentId, courseId, workGroupId);
        }

        IQueryable<SpResult> IStudRepo.SpResult => _ctx.SpResults;

        IQueryable<WorkGroup> IStudRepo.WorkGroups(bool addInstrument)
        {
            var query = _ctx.WorkGroups;

            return addInstrument
                ? query.Include(wg => wg.AssignedSpInstr)
                    .Include(wg => wg.AssignedSpInstr.InventoryCollection)
                : query;
        }

        public IQueryable<CrseStudentInGroup> CrseStudentInGroups => _ctx.StudentInGroups
            .Where(sg => !sg.IsDeleted)
            .Include(gm => gm.WorkGroup);

        public IQueryable<StudentInCourse> Courses => _ctx.StudentInCourses
            .Where(course => !course.IsDeleted);

    }
}
