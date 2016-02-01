using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Dal.Context;
using Ecat.Models;
using Newtonsoft.Json.Linq;

namespace Ecat.Dal
{
    public class SysAdminRepo : ISysAdminRepo
    {
        private readonly EcatCtx _serverCtx;
        private readonly EFContextProvider<EcatCtx> _ctxProvider;
        private readonly IBbWrapper _ws;

        public SysAdminRepo(EcatCtx serverCtx, IBbWrapper ws, EFContextProvider<EcatCtx> efCtxProvider)
        {
            _serverCtx = serverCtx;
            _ctxProvider = efCtxProvider;
            _ws = ws;

        }

        public SaveResult BzSave(JObject saveBundle, EcPerson user)
        {
            throw new NotImplementedException();
        }

        public IQueryable<EcAcademy> GetAcademies()
        {
            return _serverCtx.Academies;
        }
    }
}