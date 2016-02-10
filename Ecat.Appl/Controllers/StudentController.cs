using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using Ecat.Appl.Utilities;
using Ecat.Shared.Model;
using Ecat.Student.Core.Interface;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    //[EcatRolesAuthorized(Is = new[] { EcRoles.Student, EcRoles.External})]
    public class StudentController : EcatApiController
    {
        private readonly IStudLogic _studLogic;

        public StudentController(IStudLogic studLogic)
        {
            _studLogic = studLogic;
        }

        internal override void SetUser(Person person, MemberInCourse crseMember = null)
        {
            _studLogic.CurrentStudent = person;
            _studLogic.CurrentCrsMem = crseMember;

        }

        [HttpGet]
        public string Metadata()
        {
            return _studLogic.GetMetadata;
        }

        [HttpGet]
        public async Task<object> GetCoursesWithInitalGroups()
        {
            throw new NotImplementedException();    
        }

        [HttpGet]
        public async Task<object> GetGroupForActiveCourse()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public async Task<object> GetAllGroupData()
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            throw new NotImplementedException();
        }
    }    
}