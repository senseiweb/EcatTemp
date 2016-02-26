using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Newtonsoft.Json.Linq;

namespace Ecat.StudFunc.Core.Inteface
{
    public interface IStudLogic
    {
        Person StudentPerson { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        IQueryable<StudentInCourse> GetCrsesWithLastestGrpMem();
        Task<CrseStudentInGroup> GetWorkGroupDataForStudent();
        string GetMetadata { get; }
    }
}
    