using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Ecat.Appl.Controllers;
using Ecat.Shared.DbManager.Context;
using Ecat.Shared.Model;

namespace Ecat.Appl.Utilities
{
    [AttributeUsage(AttributeTargets.Class)]
    public class EcatRolesAuthorizedAttribute : AuthorizationFilterAttribute
    {
        public RoleMap[] Is { get; set; }
    }
}