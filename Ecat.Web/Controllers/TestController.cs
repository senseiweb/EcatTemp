using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi2;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.Web.Controllers
{
    public class TestController : EcatBaseBreezeController
    {
        private readonly ITests _test;
        public TestController(ITests test)
        {
            _test = test;
        }

        [HttpGet]
        public IQueryable<Person> Get()
        {
            return _test.Persons();
        }

        
    }

}
