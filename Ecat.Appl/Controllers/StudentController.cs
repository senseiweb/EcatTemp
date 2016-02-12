using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using System.Net.Http.Formatting;
using Ecat.Appl.Utilities;
using Ecat.Shared.Model;
using Ecat.Student.Core.Interface;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [EcatRolesAuthorized(Is = new[] { RoleMap.Student, RoleMap.External})]
    public class StudentController : EcatApiController
    {
        private readonly IStudRepo _studentRepo;

        public StudentController(IStudentRepo studentRepo)
        {
            _studentRepo = studentRepo;
        }

        internal override void SetUser(Person person, MemberInCourse crseMember)
        {
            _studentRepo = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _commonRepo.GetMetadata();
        }

        [HttpGet]
        public async Task<object> GetCourses()
        {
            return await _studentLogic.GetCourses();
        }

        [HttpGet]
        public async Task<object> GetAllGroupData(EcCourseMember selectedCourse)
        {
            return await _studentLogic.GetAllGroupData(selectedCourse);
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _studentLogic.BzSave(saveBundle);
        }
    }    
}