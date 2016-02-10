using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Ecat.Dal;
using Ecat.Dal.Context;
using Ecat.Models;
using Newtonsoft.Json.Linq;
using System.Net.Http.Formatting;
using Ecat.Bal;
using Ecat.Appl.Utilities;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [EcatRolesAuthorized(Is = new[] { EcRoles.Student, EcRoles.External})]
    public class StudentController : EcatApiController
    {
        private readonly IStudentRepo _studentRepo;

        public StudentController(IStudentRepo studentRepo)
        {
            _studentRepo = studentRepo;
        }

        internal override void SetUser(EcPerson person)
        {
            _studentRepo = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _commonRepo.GetMetadata<EcatCtx>();
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