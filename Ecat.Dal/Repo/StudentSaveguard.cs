using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.ContextProvider;
using Ecat.Dal.Context;
using Ecat.Models;

namespace Ecat.Dal
{
    using Breeze.ContextProvider.EF6;
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    public class StudentSaveguard
    {
        private readonly EcatCtx _serverCtx;
        private readonly EcPerson _loggedInPerson;
        private SaveMap _saveMapRef;
    }
}