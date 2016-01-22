using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Ecat.Models;
using Microsoft.Owin;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Ecat.Dal
{
    public class AuthServerOptions
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; set; }

        private readonly IOAuthAuthorizationServerProvider _provider;

        //static AuthServerOptions()
        //{
        //    OAuthBearerOptions = new OAuthBearerAuthenticationOptions();
        //}

        public AuthServerOptions(IUserLogic userLogic)
        {
            _provider = new AuthServerProvider(userLogic);
        }

        public OAuthAuthorizationServerOptions GetOptions()
        {
            return new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true,
                AuthenticationType = OAuthDefaults.AuthenticationType,
                AuthenticationMode = AuthenticationMode.Active,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(12),
                Provider = _provider
            };
        }

    }

    public class AuthServerProvider : OAuthAuthorizationServerProvider
    {
        private LoginToken _token;
        private readonly IUserLogic _userLogic;

        public AuthServerProvider(IUserLogic userLogic)
        {
            _userLogic = userLogic;
        }

        #region Overrides of OAuthAuthorizationServerProvider

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            await Task.FromResult(context.Validated());
        }

        #endregion

        #region Overrides of OAuthAuthorizationServerProvider

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            if (context.UserName == null || context.Password == null)
            {
                context.SetError("invalid_grant", "Invalided credentials were preseted");
                return;
            }
            var loginToken = await _userLogic.LoginUser(context.UserName, context.Password);

            if (loginToken == null)
            {
                context.SetError("invalid_grant", "User does not exist!");
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);

            identity.AddClaim(new Claim(ClaimTypes.PrimarySid, loginToken.PersonId.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.Role, loginToken.Role.ToString()));

            loginToken.TokenExpire = DateTime.Now.Add(TimeSpan.FromMinutes(60));
            loginToken.TokenExpireWarning = DateTime.Now.Add(TimeSpan.FromMinutes(55));
            _token = loginToken;
            context.Validated(identity);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            var tokenString = JsonConvert.SerializeObject(_token, Formatting.None,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                }
                );
            context.AdditionalResponseParameters.Add("loginToken", tokenString);
            return Task.FromResult<object>(null);
        }

        #endregion
    }
}