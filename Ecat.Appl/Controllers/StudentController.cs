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
using Ecat.Stud.Core.Interface;
using Ecat.Stud.Core.Interface;

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

        internal override void SetVariables(Person person)
        {
            _studLogic.Student = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _studLogic.GetMetadata;
        }

        [HttpGet]
        public async Task<List<MemberInCourse>> GetInitalCourses()
        {
            return await _studLogic.GetCrsesWithLastestGrpMem();
        }

        [HttpGet]
        public async Task<MemberInCourse> GetCrseGrpMembers(int crseMemId)
        {
            return await _studLogic.GetCrseMemById(crseMemId);

        }

        [HttpGet]
        public async Task<MemberInGroup> GetGrpMember(int grpMemId)
        {
            return await _studLogic.GetGrpMemById(grpMemId);

        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _studLogic.ClientSave(saveBundle);
        }
    }    
}