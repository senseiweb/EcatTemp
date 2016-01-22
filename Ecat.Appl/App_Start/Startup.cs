using System.Linq;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Breeze.ContextProvider.EF6;
using Ecat.Appl;
using Ecat.Bal;
using Ecat.Dal;
using Ecat.Dal.Context;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Ninject;
using Ninject.Web.Mvc;
using Ninject.Web.Common.OwinHost;
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
            AuthServerOptions.OAuthBearerOptions = new OAuthBearerAuthenticationOptions();
            var serverOptions = new AuthServerOptions(kernel.Get<IUserLogic>());
            app.UseOAuthAuthorizationServer(serverOptions.GetOptions());
            app.UseOAuthBearerAuthentication(AuthServerOptions.OAuthBearerOptions);
        }

        private static StandardKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            DependencyResolver.SetResolver(new NinjectDependencyResolver(kernel));

            kernel.Load(Assembly.GetExecutingAssembly());
            kernel.Bind<IBbWrapper>().To<BbWsWrapper>();
            kernel.Bind<ICommonRepo>().To<CommonRepo>();
            kernel.Bind<ICourseRepo>().To<CourseRepo>();
            kernel.Bind<IBbUserCheckWrapper>().To<BbUserCheckWrapper>();
            kernel.Bind<EcatCtx>().ToSelf();
            kernel.Bind<EFContextProvider<UserCtx>>().ToSelf();
            kernel.Bind<IUserRepo>().To<UserRepo>();
            kernel.Bind<IUserLogic>().To<UserLogic>();

            //var defaultFilterProviders = config.Services.GetServices(typeof(IFilterProvider)).Cast<IFilterProvider>();
            //config.Services.Clear(typeof(IFilterProvider));
            //kernel.Bind<DefaultFilterProviders>().ToConstant(new DefaultFilterProviders(defaultFilterProviders));

            //var modelValidatorProviders = config.Services.GetServices(typeof(ModelValidatorProvider)).Cast<ModelValidatorProvider>();
            //config.Services.Clear(typeof(ModelValidatorProvider));
            //kernel.Bind<DefaultModelValidatorProviders>().ToConstant(new DefaultModelValidatorProviders(modelValidatorProviders));

            return kernel;
        }
    }
}
