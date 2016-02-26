using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Newtonsoft.Json.Linq;

namespace Ecat.FacFunc.Core.Interface
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public interface IFacRepo
    {
        string Metadata { get; }
        SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards);
        IQueryable<FacultyInCourse> GetFacultyCourses { get; }
        IQueryable<CrseStudentInGroup> GetAllWorkGroupData { get; }
    }
}
