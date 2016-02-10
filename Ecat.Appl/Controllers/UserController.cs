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
using Ecat.Dal.Context;
using Ecat.Models;
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

        internal override void SetUser(Person person, MemberInCourse crseMem)
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
            return _userLogic.SaveClientUser(saveBundle);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<bool> CheckUserEmail(string email)
        {
                return await _userLogic.CheckUniqueEmail(email);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<LoginToken> Login(string userName, string userPin)
        {
            return await _userLogic.LoginUser(userName, userPin);
        }

        [HttpGet]
        public async Task<object> Profiles()
        {
            return await _userLogic.GetUserProfile();
        }

     }
}
