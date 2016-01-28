﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Ecat.Appl.Utilities;
using Ecat.Bal;
using Ecat.Dal;
using Ecat.Dal.Context;
using Ecat.Models;
using LtiLibrary.Core.Extensions;
using Newtonsoft.Json.Linq;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [EcatRolesAuthorized(Is = new [] {EcRoles.SysAdmin })]
    public class SAdminController : EcatApiController
    {
        private readonly ISysAdminLogic _saLogic;
        private readonly ICommonRepo _commonRepo;

        public SAdminController(ISysAdminLogic saLogic, ICommonRepo commonRepo)
        {
            _saLogic = saLogic;
            _commonRepo = commonRepo;
        }

        internal override void SetUser(EcPerson person)
        {
            _saLogic.User = person;
        }

        [HttpGet]
        [AllowAnonymous]
        public string Metadata()
        {
            return _commonRepo.GetMetadata<EcatCtx>();
        }

        [HttpPost]
        [AllowAnonymous]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _saLogic.BzSave(saveBundle);
        }

        public async Task<List<AcademyCategory>> AcademyCategories()
        {
            return await _saLogic.GetAcademyCategory();
        }
    }
}
