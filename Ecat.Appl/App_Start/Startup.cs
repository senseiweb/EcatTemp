﻿using System.Linq;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Breeze.ContextProvider.EF6;
using Ecat.Appl;
using Ecat.Appl.Utilities;
using Ecat.Shared.DbManager.Context;
using Ecat.Student.Core.Business;
using Ecat.Student.Core.Data;
using Ecat.Student.Core.Interface;
using Ecat.Users.Core;
using Ecat.Users.Core.Business;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Ninject;
using Ninject.Web.Common;
using Ninject.Web.Mvc;
using Ninject.Web.Common.OwinHost;
using Ninject.Web.Mvc.FilterBindingSyntax;
using Ninject.Web.WebApi.OwinHost;
using Owin;
using AuthorizeAttribute = System.Web.Http.AuthorizeAttribute;

[assembly: OwinStartup(typeof(Startup))]

namespace Ecat.Appl
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            var config = new HttpConfiguration();
            var kernel = CreateKernel();
            //Only used in mixed MVC/Application environment
            //config.SuppressDefaultHostAuthentication();

            ConfigureOauth(app, kernel);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            config.Filters.Add(new AuthorizeAttribute());
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "BreezeApi",
                routeTemplate: "breeze/{controller}/{action}"
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );


            config.Formatters.Add(new JsonMediaTypeFormatter());
            config.Formatters.JsonFormatter.SerializerSettings =
            new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(
              t => t.MediaType == "application/xml");

            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
            app.UseNinjectMiddleware(() => kernel);
            app.UseNinjectWebApi(config);
        }

        public void ConfigureOauth(IAppBuilder app, IKernel kernel)
        {
            AuthServerOptions.OabOptions = new OAuthBearerAuthenticationOptions();
            var serverOptions = new AuthServerOptions();
            app.UseOAuthAuthorizationServer(serverOptions.OauthOptions);
            app.UseOAuthBearerAuthentication(AuthServerOptions.OabOptions);
        }

        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();

            DependencyResolver.SetResolver(new NinjectDependencyResolver(kernel));

            kernel.Load(Assembly.GetExecutingAssembly());

            kernel.BindFilter<EcatAuthService>(FilterScope.Controller, null)
                .WhenControllerHas<EcatRolesAuthorizedAttribute>()
                .InRequestScope();

            kernel.Bind<IUserLogic>()
                .To<UserLogic>()
                .InRequestScope();

            kernel.Bind<IUserRepo>()
                .To<UserRepo>()
                .InRequestScope();

            kernel.Bind<IStudLogic>()
                .To<StudLogic>()
                .InRequestScope(); 

            kernel.Bind<IStudRepo>()
                .To<StudRepo>()
                .InRequestScope();

            kernel.Bind<EcatContext>()
                .ToSelf()
                .InRequestScope();

            kernel.Bind<EFContextProvider<EcatContext>>()
                .ToSelf()
                .InRequestScope();

            kernel.Bind<UserCtx>()
                .ToSelf()
                .InRequestScope();

            kernel.Bind<EFContextProvider<UserCtx>>()
                .ToSelf()
                .InRequestScope();

            kernel.Bind<StudCtx>()
                .ToSelf()
                .InRequestScope();

            kernel.Bind<EFContextProvider<StudCtx>>()
                .ToSelf()
                .InRequestScope();

            return kernel;
        }
    }
}
