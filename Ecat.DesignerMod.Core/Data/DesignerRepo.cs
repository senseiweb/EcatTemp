using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider.EF6;
using Ecat.DesignerMod.Core.Interface;

namespace Ecat.DesignerMod.Core.Data
{
    public class DesignerRepo : IDesignerRepo
    {
        private EFContextProvider<DesignerCtx> _efCtx;
        private DesignerCtx _ctx;

        public DesignerRepo(DesignerCtx ctx, EFContextProvider<DesignerCtx> efContext )
        {
            _ctx = ctx;
            _efCtx = efContext;
        }


    }
}
