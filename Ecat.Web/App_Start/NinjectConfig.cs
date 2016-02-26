using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using Ecat.FacFunc.Core.Business;
using Ecat.FacFunc.Core.Data;
using Ecat.FacFunc.Core.Interface;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.DbMgr.Context;
using Ecat.StudFunc.Core.Business;
using Ecat.StudFunc.Core.Data;
using Ecat.StudFunc.Core.Inteface;
using Ecat.UserMod.Core.Business;
using Ecat.UserMod.Core.Data;
using Ecat.UserMod.Core.Interface;
using Ninject;
using Ninject.Web.Common;
using Ninject.Web.Mvc;

namespace Ecat.Web
{
    public static class NinjectConfig
    {
        public static IKernel GetKernal()
        {
            var kernel = new StandardKernel();

            DependencyResolver.SetResolver(new NinjectDependencyResolver(kernel));

            kernel.Load(Assembly.GetExecutingAssembly());

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