using System.Linq;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Breeze.ContextProvider.EF6;
using Ecat.Appl;
using Ecat.Appl.Utilities;
using Ecat.Fac.Core.Business;
using Ecat.Fac.Core.Data;
using Ecat.Fac.Core.Interface;
using Ecat.Shared.DbManager.Context;
using Ecat.Stud.Core.Business;
using Ecat.Stud.Core.Data;
using Ecat.Stud.Core.Interface;
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
using Ninject.Web.WebApi.FilterBindingSyntax;
using Ninject.Web.WebApi.OwinHost;
using Owin;
using AuthorizeAttribute = System.Web.Http.AuthorizeAttribute;
using FilterScope = System.Web.Http.Filters.FilterScope;

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

            kernel.BindHttpFilter<EcatAuthService>(FilterScope.Controller)
                .WhenControllerHas<EcatRolesAuthorized>()
                .WithConstructorArgumentFromControllerAttribute<EcatRolesAuthorized>("roles", attribute => attribute.Is);

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

            kernel.Bind<IFacLogic>()
              .To<FacLogic>()
              .InRequestScope();

            kernel.Bind<IFacRepo>()
                .To<FacRepo>()
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

            kernel.Bind<FacCtx>()
                .ToSelf()
                .InRequestScope();

            kernel.Bind<EFContextProvider<FacCtx>>()
                .ToSelf()
                .InRequestScope();

            return kernel;
        }
    }
}
