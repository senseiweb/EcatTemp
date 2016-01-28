using System;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider.EF6;
using Ecat.Dal.BbWs.Course;
using Ecat.Dal.Context;

namespace Ecat.Dal
{
    public class CommonRepo : ICommonRepo
    {
        private readonly EcatCtx _serverCtx;
        private readonly IBbWrapper _ws;


        public string GetMetadata<T>() where T : EcatCtx, new()
        {
            var contextProvider = new EFContextProvider<T>();
            return contextProvider.Metadata();
        }

        public CommonRepo(EcatCtx serverCtx, IBbWrapper ws)
        {
            _serverCtx = serverCtx;
            _ws = ws;
        }
    }
}
