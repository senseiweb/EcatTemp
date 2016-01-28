using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using Ecat.Models;

namespace Ecat.Appl.Controllers
{

    public abstract class EcatApiController : ApiController
    {
        public EcPerson EcUser { get; set; }

        internal abstract void SetUser(EcPerson person);

        [HttpGet]
        [AllowAnonymous]
        public string Ping()
        {
            return "Pong";
        }

        [HttpGet]
        public string SecretPing()
        {
            return "Pong";
        }
    }
}