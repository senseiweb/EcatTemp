using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Breeze.WebApi2;
using Ecat.Appl.Utilities;
using Ecat.Fac.Core.Interface;
using Ecat.Shared.Model;

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
        public  IQueryable<MemberInCourse> GetInitalCourses()
        {
            return  _facLogic.GetCrsesWithLastestGrpMem();
        }

        [HttpGet]
        public IQueryable<MemberInGroup> GetWorkGroupData()
        {
            return _facLogic.GetWorkGroupById();
        }
    }
}
