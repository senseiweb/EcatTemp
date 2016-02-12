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

        public override async Task OnAuthorizationAsync(HttpActionContext actionContext, CancellationToken token)
        {

            OnAuthorization(actionContext);

            #region Check if userId is in the claims
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
            #endregion

            #region Check if known roles is present
            var roleClaim = RoleMap.Unknown;

            var stringRoleClaim = principal.FindFirst(ClaimTypes.Role).Value;
            if (stringRoleClaim != null)
            {
                Enum.TryParse(stringRoleClaim, out roleClaim);
            }

            if (Is != null && !Is.Contains(roleClaim))
            {
                actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Unathorized access");
            }
            #endregion

            #region Check if auth headers are present
            IEnumerable<string> headers;

            actionContext.Request.Headers.TryGetValues("X-ECAT-PVT-AUTH", out headers);

            headers = headers.ToList();

            var crseMemId = 0;
            var grpMemId = 0;

            if (headers.Any())
            {
                AuthHeaderType authType;
                var authHeader = headers.First().Split(':');
                Enum.TryParse(authHeader[0], out authType);
                if (authType == AuthHeaderType.CourseMember)
                {
                    var hasCrseMemId = int.TryParse(authHeader[1], out crseMemId);
                    if (!hasCrseMemId)
                    {
                        actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Attempted to authorize as course member but the request is malformed!");
                    }
                }

                if (authType == AuthHeaderType.GroupMember)
                {
                    var hasCrseMemId = int.TryParse(authHeader[1], out grpMemId);
                    if (!hasCrseMemId)
                    {
                        actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Attempted to authorize as course member but the request is malformed!");
                    }
                }
            }
            #endregion

            Person user;
            var courseMember = default(MemberInCourse);
            var groupMember = default(MemberInGroup);

            using (var ctx = new EcatContext())
            {
                user = await ((DbSet<Person>)ctx.People).FindAsync(token, parsedUid);

                if (crseMemId != 0)
                {
                    courseMember = await ((DbSet<MemberInCourse>)ctx.MemberInCourses).FindAsync(token, crseMemId);
                }

                if (grpMemId != 0)
                {
                    groupMember = await ((DbSet<MemberInGroup>)ctx.MemberInGroups).FindAsync(token, grpMemId);
                }
            }

            if (user == null)
            {
                actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized,
                    "Unable to locte user from Authorization Filter using data store");
            }

            var controller = actionContext.ControllerContext.Controller as EcatApiController;

            Contract.Assert(controller != null);

            controller.SetVariables(user, courseMember, groupMember);
        }

        private static bool SkipAuthorization(HttpActionContext actionContext)
        {
            Contract.Assert(actionContext != null);

            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }
    }
}