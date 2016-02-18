using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Breeze.WebApi2;
using Ecat.Appl.Utilities;
using Ecat.Shared.Model;
using FacCore.Interface;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [EcatRolesAuthorized(Is = new[] { RoleMap.Facilitator })]
    public class FacilitatorController : EcatApiController
    {
        private readonly IFacLogic _facLogic;

        public FacilitatorController(IFacLogic facLogic)
        {
            _facLogic = facLogic;
        }

        internal override void SetVariables(Person person)
        {
            _facLogic.Facilitator = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _facLogic.GetMetadata;
        }

        [HttpGet]
        public async Task<List<MemberInCourse>> GetInitalCourses()
        {
            return await _facLogic.GetCrsesWithLastestGrpMem();
        }
    }
}
