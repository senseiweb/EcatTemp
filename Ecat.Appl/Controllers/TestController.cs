using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using Breeze.WebApi2;
using Ecat.Fac.Core.Data;
using Ecat.Shared.DbManager.Context;
using Ecat.Shared.Model;
using Ecat.Users.Core;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    public class TestController : EcatApiController
    {
        private readonly FacCtx _ctx;
        public TestController(FacCtx ctx)
        {
            _ctx = ctx;
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<MemberInGroup> Groups()
        {
            return _ctx.MemberInGroups;
        }

        internal override void SetVariables(Person person)
        {
            throw new NotImplementedException();
        }
    }
}
