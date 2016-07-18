﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi2;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.Web.Controllers
{
    [BreezeController]
    public class EcatBaseBreezeController : ApiController
    {
        internal virtual void SetUser(Person person) { }

        [HttpGet]
        [AllowAnonymous]
        public string Ping()
        {
            using (var ctx = new EcatContext())
            {
                ctx.Database.ExecuteSqlCommand($"Insert into dbo.EventLogs (LogEvent) Values ('Pinging');");
            }

            return "Pong";
        }

        [HttpGet]
        [Authorize]
        public string SecuredPing()
        {
            try
            {
                return "Secured Pong";
            }
            catch (Exception)
            {
                using (var ctx = new EcatContext())
                {
                    ctx.Database.ExecuteSqlCommand($"Insert into dbo.EventLogs (LogEvent) Values ('Secured Pong Error');");
                }
                throw;
            }
        }
    }
}
