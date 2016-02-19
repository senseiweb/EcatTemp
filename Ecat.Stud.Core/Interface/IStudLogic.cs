using System.Collections.Generic;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Newtonsoft.Json.Linq;

namespace Ecat.Stud.Core.Interface
{
    public interface IStudLogic
    {
        Person Student { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        Task<List<MemberInCourse>> GetCrsesWithLastestGrpMem();
        Task<MemberInCourse> GetCrseMemById(int crseMemId);
        Task<MemberInGroup> GetGrpMemById(int grpMemId);
        string GetMetadata { get; }
    }
}
