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
        SaveResult ClientSave(JObject saveBundle);
        Task<List<MemberInCourse>> GetCrsesWithLastestGrpMem();
        Task<MemberInCourse> GetCrseMemById(int crseMemId);
        Task<MemberInGroup> GetGrpMemById(int grpMemId);
        string GetMetadata { get; }
    }
}
