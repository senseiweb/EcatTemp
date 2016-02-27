using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData.Query;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.StudMod.Core;
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
        [EnableBreezeQuery(MaxExpansionDepth = 1, AllowedArithmeticOperators = AllowedArithmeticOperators.None)]
        public IQueryable<CrseStudentInGroup> GetInitalCourses()
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
