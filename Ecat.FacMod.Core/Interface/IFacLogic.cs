using System.Linq;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Newtonsoft.Json.Linq;

namespace Ecat.FacMod.Core
{
    public interface IFacLogic
    {
        Person FacultyPerson { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        string GetMetadata { get; }
        IQueryable<FacultyInCourse> GetCrsesWithLastestGrpMem();
        IQueryable<CrseStudentInGroup> GetWorkGroupSpData(int courseId, int workGroupId, bool addAssessment);
        IQueryable<FacultyInCourse> GetActiveCourseData(int courseId);
        IQueryable<StudSpComment> GetStudSpComments();
        IQueryable<WorkGroup> GetWorkGroupResults();
    }
}
