using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public interface IStudRepo
    {
        string GetMetadata { get; }
        SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards);
        IQueryable<CrseStudentInGroup> CrseStudentInGroups { get; }
        IQueryable<StudentInCourse> Courses { get; }
        IQueryable<SpResult> SpResult { get; }
        IQueryable<WorkGroup> WorkGroups(bool addInstrument);
        Task<FacResultForStudent> GetFacSpResult(int studId, int wgId);
    }
}
