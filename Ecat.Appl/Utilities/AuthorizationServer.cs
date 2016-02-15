﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Ecat.Shared.Model;
using Ecat.Users.Core;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ecat.Appl.Utilities
{
    public static class UserAuthToken
    {
        public static ClaimsIdentity GetClaimId => new ClaimsIdentity(AuthServerOptions.OabOptions.AuthenticationType);

        public static string GetAuthToken(ClaimsIdentity id)
        {
            var ticket = new AuthenticationTicket(id, new AuthenticationProperties
            {
                IssuedUtc = DateTime.Now,
                ExpiresUtc = DateTime.Now.Add(TimeSpan.FromMinutes(60))
            });
            return AuthServerOptions.OabOptions.AccessTokenFormat.Protect(ticket);
        }

    }

    public class AuthServerOptions
    {
        public static OAuthBearerAuthenticationOptions OabOptions { get; set; }

        private readonly IOAuthAuthorizationServerProvider _provider;

        public AuthServerOptions(IUserLogic userLogic)
        {
            _provider =new AuthorizationServer(userLogic);
        }

        public OAuthAuthorizationServerOptions OauthOptions => new OAuthAuthorizationServerOptions
        {
            //TODO: change to false for deployment
            AllowInsecureHttp = true,
            AuthenticationType = OAuthDefaults.AuthenticationType, 
            AuthenticationMode =  AuthenticationMode.Active,
            TokenEndpointPath = new PathString("/ecat-token"),
            AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(60),
            Provider = _provider
        };
    }

    public class AuthorizationServer : OAuthAuthorizationServerProvider
    {
        private LoginToken _loginToken;
        private readonly IUserLogic _userLogic;

        public AuthorizationServer(IUserLogic userLogic)
        {
            _userLogic = userLogic;
        }

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            await Task.FromResult(context.Validated());
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            if (context.UserName == null || context.Password == null)
            {
                context.SetError("invalid_grant", "Null credentials were preseted");
                return;
            }
            var person = await _userLogic.LoginUser(context.UserName, context.Password);


            var identity = UserAuthToken.GetClaimId;

            identity.AddClaim(new Claim(ClaimTypes.PrimarySid, person.PersonId.ToString()));

            identity.AddClaim(new Claim(ClaimTypes.Role, MpTransform.InstituteRoleToEnum(person.MpInstituteRole).ToString()));

            _loginToken = new LoginToken
            {
                TokenExpire = DateTime.Now.Add(TimeSpan.FromMinutes(60)),
                TokenExpireWarning = DateTime.Now.Add(TimeSpan.FromMinutes(55)),
                Person = person,
                PersonId = person.PersonId
            };
            context.Validated(identity);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            var tokenString = JsonConvert.SerializeObject(_loginToken, Formatting.None,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                }
                );
            context.AdditionalResponseParameters.Add("loginToken", tokenString);
            return Task.FromResult<object>(null);
        }
    }
}