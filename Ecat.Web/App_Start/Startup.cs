using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Ecat.Web;
using Ecat.Web.Provider;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Ninject.Web.Common.OwinHost;
using Ninject.Web.WebApi;
using Ninject.Web.WebApi.OwinHost;
using Owin;

[assembly: OwinStartup(typeof(Startup))]

namespace Ecat.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            #region Add/Remove Filters
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            #endregion

            #region MVC Route Configuration
            RouteTable.Routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            RouteTable.Routes.MapRoute(name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Lti", action = "Ping", id = UrlParameter.Optional });
            #endregion

            #region Api Route Configuration
            config.Routes.MapHttpRoute(
                name: "BreezeApi",
                routeTemplate: "breeze/{controller}/{action}"
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );
            #endregion

            #region Add/Remove Formatters
            var xmlSuptTypes = config.Formatters.XmlFormatter.SupportedMediaTypes;
            var xmlTypes  = xmlSuptTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            if (xmlTypes != null) 
            {
                xmlSuptTypes.Remove(xmlTypes);
            }
            #endregion

            ConfigureOauth(app);
            app.UseNinjectMiddleware(NinjectConfig.GetKernal);
            app.UseNinjectWebApi(config);
        }

        public void ConfigureOauth(IAppBuilder app)
        {
            AuthServerOptions.OabOpts = new OAuthBearerAuthenticationOptions();
            var serverOpts = new AuthServerOptions();
            app.UseOAuthAuthorizationServer(serverOpts.OauthOpts);
            app.UseOAuthBearerAuthentication(AuthServerOptions.OabOpts);
        }
    }
}
