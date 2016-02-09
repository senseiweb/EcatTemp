using System.Data.Entity;
using Ecat.Shared.Core.Config;

namespace Ecat.Shared.Core
{
    public class EcatBaseContext<TContext> : DbContext where TContext: DbContext
    {
        static EcatBaseContext()
        {
            Database.SetInitializer<TContext>(null);
        }
        
        protected EcatBaseContext(): base("EcatSqlServer") { }

        protected override void OnModelCreating(DbModelBuilder mb)
        {

            base.OnModelCreating(mb);
        }
    }


}
