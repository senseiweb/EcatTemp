using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using System.Net.Http.Formatting;
using Ecat.Appl.Utilities;
using Ecat.Shared.Core.Providers;
using Ecat.Shared.Model;
using Ecat.Users.Core;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [EcatRolesAuthorized]
    public class UserController : EcatApiController
    {
        private readonly IUserLogic _userLogic;

        public UserController(IUserLogic userLogic) 
        {
            _userLogic = userLogic;
        }

        internal override void SetVariables(Person person, MemberInCourse crseMem)
        {
            _userLogic.CurrentUser = person;
        }

        [HttpGet]
        [AllowAnonymous]
        public string Metadata()
        {
            return _userLogic.GetMetadata;
        }

        [HttpPost]
        [AllowAnonymous]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _userLogic.ClientSave(saveBundle);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<bool> CheckUserEmail(string email)
        {
            var emailChecker = new ValidEmailChecker();
            return !emailChecker.IsValidEmail(email) && await _userLogic.UniqueEmailCheck(email);
        }

        [HttpGet]
        public async Task<object> Profiles()
        {
            return await _userLogic.GetProfile();
        }

     }
}
