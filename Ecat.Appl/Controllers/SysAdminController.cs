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
using Ecat.Shared.Model;
using LtiLibrary.Core.Extensions;
using Newtonsoft.Json.Linq;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [EcatRolesAuthorized(Is = new [] {RoleMap.SysAdmin})]
    public class SysAdminController : EcatApiController
    {
        private readonly ISysAdminLogic _saLogic;
        private readonly ICommonRepo _commonRepo;

        public SysAdminController(ISysAdminLogic saLogic, ICommonRepo commonRepo)
        {
            _saLogic = saLogic;
            _commonRepo = commonRepo;
        }

        internal override void SetUser(Person person)
        {
            _saLogic. = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _commonRepo.GetMetadata<EcatCtx>();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _saLogic.BzSave(saveBundle);
        }

        [HttpGet]
        public async Task<List<AcademyCategory>> AcademyCategories()
        {
            return await _saLogic.GetAcademyCategory();
        }
    
        [HttpGet]
        public IQueryable<EcAcademy> Academies()
        {
          return  _saLogic.GetAcademies();
        }
    }
}
