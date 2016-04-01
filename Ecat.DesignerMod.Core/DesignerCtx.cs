using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.DesignerMod.Core
{
    public class DesignerCtx: ContextBase<DesignerCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            base.OnModelCreating(mb);
        }
    }
}
