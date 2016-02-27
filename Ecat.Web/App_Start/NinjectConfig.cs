using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using Ecat.FacMod.Core;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.DbMgr.Context;
using Ecat.StudMod.Core;
using Ecat.UserMod.Core;
using Ecat.Web.Provider;
using Ecat.Web.Utility;
using Ninject;
using Ninject.Web.Common;
using Ninject.Web.Mvc;
using Ninject.Web.WebApi.FilterBindingSyntax;
using FilterScope = System.Web.Http.Filters.FilterScope;

namespace Ecat.Web
{
    public static class NinjectConfig
    {
        public static IKernel GetKernal()
        {
            var kernel = new StandardKernel();

            DependencyResolver.SetResolver(new NinjectDependencyResolver(kernel));

            kernel.Load(Assembly.GetExecutingAssembly());
            kernel.BindHttpFilter<AuthorizedFilterService>(FilterScope.Controller)
                .WhenControllerHas<EcatRolesAuthorized>()
                .WithConstructorArgumentFromControllerAttribute<EcatRolesAuthorized>("roles", attribute => attribute.Is);    
                            kernel.Bind<ITests>().To<DependencyTest>();
            kernel.Bind<EcatContext>().ToSelf().InRequestScope();
            kernel.Bind<IUserLogic>().To<UserLogic>().InRequestScope();
            kernel.Bind<IUserRepo>().To<UserRepo>().InRequestScope();
            kernel.Bind<IFacLogic>().To<FacLogic>().InRequestScope();
            kernel.Bind<IFacRepo>().To<FacRepo>().InRequestScope();
            kernel.Bind<IStudLogic>().To<StudLogic>().InRequestScope();
            kernel.Bind<IStudRepo>().To<StudRepo>().InRequestScope();
            kernel.Bind<StudCtx>().ToSelf().InRequestScope();
            kernel.Bind<FacCtx>().ToSelf().InRequestScope();

            return kernel;
         }
    }
}