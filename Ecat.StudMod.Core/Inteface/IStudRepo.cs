using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{

    public interface IStudRepo
    {
        string GetMetadata { get; }
        SaveResult ClientSaveChanges(JObject saveBundle);
        IQueryable<CrseStudentInGroup> CrseStudentInGroups { get; }
        IQueryable<StudentInCourse> Courses { get; }
        IQueryable<SpResult> SpResult { get; }

        IQueryable<SpInventory> Inventories { get; }

        IQueryable<WorkGroup> WorkGroups(bool addInstrument);
        Task<FacResultForStudent> GetFacSpResult(int studId, int wgId);
        void LoadGroupPeers(CrseStudentInGroup groupMember);
    }
}
