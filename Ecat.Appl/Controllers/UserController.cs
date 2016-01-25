using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Ecat.Dal;
using Ecat.Dal.Context;
using Ecat.Models;
using Newtonsoft.Json.Linq;
using System.Net.Http.Formatting;
using Ecat.Bal;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    public class UserController : ApiController
    {
        private readonly ICommonRepo _commonRepo;
        private readonly IUserLogic _userLogic;

        /// <summary>
        /// Initializes the <see cref="T:System.Web.Http.ApiController"/> instance with the specified controllerContext.
        /// </summary>
        /// <param name="controllerContext">The <see cref="T:System.Web.Http.Controllers.HttpControllerContext"/> object that is used for the initialization.</param>
        protected override void Initialize(HttpControllerContext controllerContext)
        {

            var caller = User as ClaimsPrincipal;

            var isAuthenticated = caller != null && caller.Identity.IsAuthenticated;

            if (!isAuthenticated)
            {
                base.Initialize(controllerContext);

            }
            else
            {
                var parsedUid = 0;
                var stringUid = caller.FindFirst(ClaimTypes.PrimarySid).Value;
                if (stringUid != null)
                {
                    int.TryParse(stringUid, out parsedUid);
                }

                var roleString = caller.FindFirst(ClaimTypes.Role).Value;
                _userLogic.EcatInstitueRole = (EcRoles) Enum.Parse(typeof (EcRoles), roleString);

                _userLogic.EcatUserId = parsedUid;
                base.Initialize(controllerContext);
            }

        }

        public UserController(ICommonRepo common, IUserLogic userLogic)
        {
            _commonRepo = common;
            _userLogic = userLogic;
        }

        [HttpGet]
        [AllowAnonymous]
        public string Metadata()
        {
            return _commonRepo.GetMetadata<UserCtx>();
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

        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword(FormDataCollection form)
        {
            
            var oldPassword = form["Old"];
            var newPassword = form["New"];

            var success = await _userLogic.ChangePasswordSuccess(oldPassword, newPassword);

            if (success)
            {
                return Ok("Change Processed");
            }
            return BadRequest("Unabe to Process changes!");
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

        [HttpGet]
        [AllowAnonymous]
        public async Task<EcPerson> ResetPin(string bbUserId, string bbUserPass, string newUserPin)
        {
            return await _userLogic.ResetPin(bbUserId, bbUserPass, newUserPin);
        }

        [HttpGet]
        [AllowAnonymous]
        public string Ping()
        {
            return "Pong";
        }

        [HttpGet]
        public string SecretPin()
        {
            return "Pong";
        }
    }
}
