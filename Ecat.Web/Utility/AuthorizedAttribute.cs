using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Filters;
using Ecat.Shared.Core.Utility;

namespace Ecat.Web.Utility
{
    [AttributeUsage(AttributeTargets.Class)]
    public class EcatRolesAuthorized : AuthorizationFilterAttribute
    {
        public RoleMap[] Is { get; set; }

        public override bool AllowMultiple => false;
    }
}