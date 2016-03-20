using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.Context;
using Ecat.UserMod.Core;
using LtiLibrary.AspNet.Extensions;
using LtiLibrary.Core.Lti1;

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


