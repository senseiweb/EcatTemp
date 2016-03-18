using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{
    public interface IStudLogic
    {
        Person StudentPerson { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        IQueryable<CrseStudentInGroup> GetInitalCourses();
        IQueryable<StudentInCourse> GetSingleCourse();
        Task<SpResult> GetWrkGrpResult(int wgId, bool addInstrument);
        Task<CrseStudentInGroup> GetSingleWrkGrpMembers(int wgId);
        string GetMetadata { get; }
    }
}
    