using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.StudFunc.Core.Inteface;
using Ecat.Web.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.Web.Controllers
{
    [EcatRolesAuthorized(Is = new[] { RoleMap.Student })]
    public class StudentController : EcatBaseBreezeController
    {
        private readonly IStudLogic _studLogic;

        public StudentController(IStudLogic studLogic)
        {
            _studLogic = studLogic;
        }

        internal override void SetUser(Person person)
        {
            _studLogic.StudentPerson = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _studLogic.GetMetadata;
        }

        [HttpGet]
        public IQueryable<StudentInCourse> GetInitalCourses()
        {
            return _studLogic.GetCrsesWithLastestGrpMem();
        }

        //[HttpGet]
        //public async Task<MemberInCourse> GetCrseGrpMembers(int crseMemId)
        //{
        //    return await _studLogic.GetCrseMemById(crseMemId);

        //}

        //[HttpGet]
        //public async Task<MemberInGroup> GetGrpMember(int grpMemId)
        //{
        //    return await _studLogic.GetGrpMemById(grpMemId);

        //}

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _studLogic.ClientSave(saveBundle);
        }
    }
}
