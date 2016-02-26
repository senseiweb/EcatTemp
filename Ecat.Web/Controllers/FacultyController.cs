using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ecat.FacFunc.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.Web.Controllers
{
    //[EcatRolesAuthorized(Is = new[] { RoleMap.Facilitator })]
    public class FacultyController : EcatBaseBreezeController
    {
        private readonly IFacLogic _facLogic;

        public FacultyController(IFacLogic facLogic)
        {
            _facLogic = facLogic;
        }

        internal override void SetUser(Person person)
        {
            _facLogic.FacultyPerson = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _facLogic.GetMetadata;
        }

        [HttpGet]
        public IQueryable<FacultyInCourse> GetInitalCourses()
        {
            return _facLogic.GetCrsesWithLastestGrpMem();
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<CrseStudentInGroup> GetWorkGroupData()
        {
            return _facLogic.GetMembersByCrseId();
        }
    }
}
