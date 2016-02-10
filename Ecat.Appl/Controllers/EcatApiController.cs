using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using Ecat.Models;
using Ecat.Shared.Model;

namespace Ecat.Appl.Controllers
{

    public abstract class EcatApiController : ApiController
    {
        public Person Person { get; set; }

        internal abstract void SetUser(Person person, MemberInCourse courseMember);

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