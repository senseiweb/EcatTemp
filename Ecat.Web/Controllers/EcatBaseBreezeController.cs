using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi2;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.Web.Controllers
{
    [BreezeController]
    public class EcatBaseBreezeController : ApiController
    {
        internal virtual void SetUser(Person person) { }

        [HttpGet]
        public string Ping()
        {
            return "Pong";
        }

        [HttpGet]
        [Authorize]
        public string SecuredPing()
        {
            return "Secured Pong";
        }
    }
}
