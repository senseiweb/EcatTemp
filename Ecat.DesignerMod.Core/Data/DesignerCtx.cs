using System.Data.Entity;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.DesignerMod.Core.Data
{
    public class DesignerCtx: ContextBase<DesignerCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            base.OnModelCreating(mb);
        }

    }
}
