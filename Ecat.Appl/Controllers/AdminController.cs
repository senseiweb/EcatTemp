using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Ecat.Admin.Core.Interface;
using Ecat.Appl.Utilities;
using Ecat.Shared.Model;
using Newtonsoft.Json.Linq;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [EcatRolesAuthorized(Is = new [] {RoleMap.SysAdmin})]
    public class AdminController : EcatApiController
    {
        private readonly IAdminLogic _adminLogic;

        public AdminController(IAdminLogic adminLogic)
        {
            _adminLogic = adminLogic;
        }
        
        internal override void SetVariables(Person person)
        {
            _adminLogic.Admin = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _adminLogic.GetMetadata;
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _adminLogic.ClientSave(saveBundle);
        }

        [HttpGet]
        public List<Academy> Academies()
        {
          return  _adminLogic.GetAcademies();
        }
    }
}
