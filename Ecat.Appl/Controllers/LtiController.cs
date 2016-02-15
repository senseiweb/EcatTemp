using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Ecat.Appl.Utilities;
using Ecat.Shared.Model;
using Ecat.Users.Core;
using LtiLibrary.AspNet.Extensions;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ecat.Appl.Controllers
{
    public class LtiController : Controller
    {
        private readonly IUserLogic _userLogic;

        private const string LtiSecret = "keiri9303iei32-1a;vdap3";

        public LtiController(IUserLogic userLogic)
        {
            _userLogic = userLogic;
        }

        public string Ping()
        {
            return "Pong";
        }

        [HttpPost]
        public async Task<ActionResult> Secure()
        {
            try
            {
                Request.CheckForRequiredLtiParameters();
            }
            catch
            {
                ViewBag.User = "Error";
                return View();
            }

            var ltiRequest = new LtiRequest();

            ltiRequest.ParseRequest(Request);

            //TODO: Implement this a security measure!
            //var expectedOauthSignature = Request.GenerateOAuthSignature(LtiSecret);

            //if (!expectedOauthSignature.Equals(ltiRequest.Signature))
            //{
            //    ViewBag.Error = "Unauthorized Signature of Data Call";
            //    return View("Error");
            //};

            var user = await _userLogic.ProcessLtiUser(ltiRequest);

            var loginToken = new LoginToken
            {
                PersonId = user.PersonId,
                Person = user
            };

            var identity =  UserAuthToken.GetClaimId;

            identity.AddClaim(new Claim(ClaimTypes.PrimarySid, user.PersonId.ToString()));

            identity.AddClaim(new Claim(ClaimTypes.Role, MpTransform.InstituteRoleToEnum(user.MpInstituteRole).ToString()));

            loginToken.TokenExpire = DateTime.Now.Add(TimeSpan.FromMinutes(60));
            loginToken.TokenExpireWarning = DateTime.Now.Add(TimeSpan.FromMinutes(55));
            loginToken.AuthToken = UserAuthToken.GetAuthToken(identity);
            
            var settings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
            ViewBag.User = JsonConvert.SerializeObject(loginToken, settings);

            return View();
        }

    }
}
