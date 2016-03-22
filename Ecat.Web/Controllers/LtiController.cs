using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.Context;
using Ecat.UserMod.Core;
using Ecat.Web.Provider;
using Ecat.Web.Utility;
using LtiLibrary.AspNet.Extensions;
using LtiLibrary.Core.Lti1;
using Microsoft.Owin.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ecat.Web.Controllers
{
    public class LtiController : Controller
    {
        private readonly IUserLogic _userLogic;

        public LtiController(IUserLogic userLogic)
        {
            _userLogic = userLogic;
        }
     
        // GET: Lti
        public async Task<ActionResult> Secure()
        {
            var isLti = Request.IsAuthenticatedWithLti();
            if (!isLti)
            {
                return null;
            }

            var ltiRequest = new LtiRequest();

            ltiRequest.ParseRequest(Request);

            var person = await _userLogic.ProcessLtiUser(ltiRequest);
            
            var token = new LoginToken
            {
                PersonId = person.PersonId,
                Person = person,
                TokenExpire = DateTime.Now.Add(TimeSpan.FromMinutes(60)),
                TokenExpireWarning = DateTime.Now.Add(TimeSpan.FromMinutes(55)),
            };

            var identity = UserAuthToken.GetClaimId;
            identity.AddClaim(new Claim(ClaimTypes.PrimarySid, token.PersonId.ToString()));

            switch (person.MpInstituteRole)
            {
                case MpInstituteRoleId.Faculty:
                    person.Faculty = null;
                    identity.AddClaim(new Claim(ClaimTypes.Role, RoleMap.Faculty.ToString()));
                    break;
                case MpInstituteRoleId.Student:
                    identity.AddClaim(new Claim(ClaimTypes.Role, RoleMap.Student.ToString()));
                    break;
                default:
                    identity.AddClaim(new Claim(ClaimTypes.Role, RoleMap.External.ToString()));
                    break;
            }

            var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());

            ticket.Properties.IssuedUtc = DateTime.Now;
            ticket.Properties.ExpiresUtc = DateTime.Now.AddMinutes(60);

            token.AuthToken = AuthServerOptions.OabOpts.AccessTokenFormat.Protect(ticket);

            ViewBag.User = JsonConvert.SerializeObject(token, Formatting.None,
                 new JsonSerializerSettings
                 {
                     ContractResolver = new CamelCasePropertyNamesContractResolver(),
                     ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                 });

            return View();
        }

        public string Ping2()
        {
            return "Ping 2";
        } 

        public string Ping()
        {
            return "Pong";
        }
    }
}


