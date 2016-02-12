using System;
using System.Collections.Generic;
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
    [EcatRolesAuthorized(Is = new[] { RoleMap.Student})]
    public class StudentController : EcatApiController
    {
        private readonly IStudLogic _studLogic;

        public StudentController(IStudLogic studLogic)
        {
            _studLogic = studLogic;
        }

        internal override void SetVariables(Person person, 
            MemberInCourse crseMember = null, 
            MemberInGroup  grpMember = null)
        {
            _studLogic.Student = person;
            _studLogic.CrsMem = crseMember;
            _studLogic.GrpMem = grpMember;
        }

        [HttpGet]
        public string Metadata()
        {
            return _studLogic.GetMetadata;
        }

        [HttpGet]
        public async Task<IEnumerable<Course>> GetInitalCourses()
        {
            return await _studLogic.GetCrsesWithLastGrpMem();
        }

        [HttpGet]
        public async Task<IEnumerable<WorkGroup>> GetCourseGrpMembers()
        {
            return await _studLogic.GetGroupsAndMemForCourse();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _studLogic.ClientSave(saveBundle);
        }
    }    
}