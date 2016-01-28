using System;
using System.Collections.Generic;
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
using Ecat.Dal.Context;
using Ecat.Models;

namespace Ecat.Appl.Utilities
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class EcatRolesAuthorizedAttribute : AuthorizationFilterAttribute
    {
        public EcRoles[] Is { get; set; }

        public override async Task OnAuthorizationAsync(HttpActionContext actionContext, CancellationToken token)
        {

            OnAuthorization(actionContext);

            var principal = actionContext.RequestContext.Principal as ClaimsPrincipal;

            if (principal == null || !principal.Identity.IsAuthenticated)
            {
                if (!SkipAuthorization(actionContext)) throw new ArgumentNullException(nameof(principal));
                await Task.FromResult<object>(null);
                return;
            }

            var parsedUid = 0;
            var stringUid = principal.FindFirst(ClaimTypes.PrimarySid).Value;
            if (stringUid != null)
            {
                int.TryParse(stringUid, out parsedUid);
            }

            if (parsedUid == 0)
            {
                actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Unable to locte user from Authorization Filter");
            }

            var roleClaim = EcRoles.Unknown;

            var stringRoleClaim = principal.FindFirst(ClaimTypes.Role).Value;
            if (stringRoleClaim != null)
            {
                Enum.TryParse(stringRoleClaim, out roleClaim);
            }

            if (Is != null && !Is.Contains(roleClaim))
            {
                actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Unathorized access");
            }

            EcPerson user;

            using (var ctx = new EcatCtx())
            {
                user = await ctx.Persons.FindAsync(token, parsedUid);
            }

            if (user == null)
            {
                actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized,
                    "Unable to locte user from Authorization Filter using data store");
            }
            var controller = actionContext.ControllerContext.Controller as EcatApiController;

            Contract.Assert(controller != null);

            controller.SetUser(user);
        }

        private static bool SkipAuthorization(HttpActionContext actionContext)
        {
            Contract.Assert(actionContext != null);

            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }
    }
}