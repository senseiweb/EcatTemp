using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Newtonsoft.Json.Linq;

namespace Ecat.Student.Core.Interface
{
    public interface IStudLogic
    {
        Person Student { get; set; }
        MemberInCourse CrsMem { get; set; }
        MemberInGroup GrpMem { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        Task<List<MemberInCourse>> GetCrsesWithLastestGrpMem();
        Task<IEnumerable<WorkGroup>> GetGroupsAndMemForCourse();
        Task<IEnumerable<MemberInGroup>> GetPeersForGrp();
        string GetMetadata { get; }
    }
}
