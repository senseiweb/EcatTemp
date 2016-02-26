using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Newtonsoft.Json.Linq;

namespace Ecat.FacFunc.Core.Interface
{
    public interface IFacLogic
    {
        Person FacultyPerson { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        string GetMetadata { get; }
        IQueryable<FacultyInCourse> GetCrsesWithLastestGrpMem();
        IQueryable<CrseStudentInGroup> GetMembersByCrseId();
    }
}
