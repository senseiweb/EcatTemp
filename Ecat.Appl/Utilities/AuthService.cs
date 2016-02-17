using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Ecat.Appl.Controllers;
using Ecat.Shared.Core;
using Ecat.Shared.DbManager.Context;
using Ecat.Shared.Model;

namespace Ecat.Appl.Utilities
{
    public class EcatAuthService : IAuthenticationFilter
    {
        public bool AllowMultiple { get; }

        private readonly EcatContext _ctx;
        private readonly RoleMap[] _authRoles;

        public EcatAuthService(EcatContext ctx, RoleMap[] roles)
        {
            _ctx = ctx;
            _authRoles = roles;
        }

        private static bool SkipAuthorization(HttpAuthenticationContext httpContext)
        {
            Contract.Assert(httpContext != null);

            return httpContext.ActionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || httpContext.ActionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }

        public async Task AuthenticateAsync(HttpAuthenticationContext httpContext, CancellationToken token)
        {
            #region Check if userId is in the claims

            var principal = httpContext.Principal as ClaimsPrincipal;

            if (principal == null || !principal.Identity.IsAuthenticated)
            {
                if (!SkipAuthorization(httpContext)) throw new ArgumentNullException(nameof(principal));
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
                httpContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized,
                    "Unable to locate user from Authorization Filter");
            }

            #endregion

            #region Check if known roles is present
               
            var roleClaim = RoleMap.Unknown;

            var stringRoleClaim = principal.FindFirst(ClaimTypes.Role).Value;
            if (stringRoleClaim != null)
            {
                Enum.TryParse(stringRoleClaim, out roleClaim);
            }
 
            if (_authRoles != null && !_authRoles.Contains(roleClaim))
            {
                httpContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Unauthorized access");
            }

            #endregion

            #region Check if auth headers are present

            IEnumerable<string> headers;

            httpContext.Request.Headers.TryGetValues("X-ECAT-PVT-AUTH", out headers);

            headers = headers?.ToList();

            var crseMemId = 0;
            var grpMemId = 0;

            if (headers != null && headers.Any())
            {
                AuthHeaderType authType;
                var authHeader = headers.First().Split(':');
                Enum.TryParse(authHeader[0], out authType);
                if (authType == AuthHeaderType.CourseMember)
                {
                    var hasCrseMemId = int.TryParse(authHeader[1], out crseMemId);
                    if (!hasCrseMemId)
                    {
                        httpContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                            "Attempted to authorize as course member but the request is malformed!");
                    }
                }

                if (authType == AuthHeaderType.GroupMember)
                {
                    var hasCrseMemId = int.TryParse(authHeader[1], out grpMemId);
                    if (!hasCrseMemId)
                    {
                        httpContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                            "Attempted to authorize as course member but the request is malformed!");
                    }
                }
            }

            #endregion

            var courseMember = default(MemberInCourse);
            var groupMember = default(MemberInGroup);

            var user = await ((DbSet<Person>) _ctx.People).FindAsync(token, parsedUid);

            if (crseMemId != 0)
            {
                courseMember = await ((DbSet<MemberInCourse>) _ctx.MemberInCourses).FindAsync(token, crseMemId);
            }

            if (grpMemId != 0)
            {
                groupMember = await ((DbSet<MemberInGroup>) _ctx.MemberInGroups).FindAsync(token, grpMemId);
            }

            if (user == null)
            {
                httpContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized,
                    "Unable to locate user from Authorization Filter using data store");
            }

            var controller = httpContext.ActionContext.ControllerContext.Controller as EcatApiController;

            Contract.Assert(controller != null);

            controller.SetVariables(user, courseMember, groupMember);

        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            return Task.FromResult(true);
        }
    }
}