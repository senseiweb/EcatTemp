using System.Data.Entity;

namespace Ecat.Shared.Core
{
    public class EcatBaseContext<TContext> : DbContext where TContext: DbContext
    {
        static EcatBaseContext()
        {
            Database.SetInitializer<TContext>(null);
        }

        protected EcatBaseContext() : base("EcatSqlServer")
        {
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder mb)
        {

            base.OnModelCreating(mb);
        }
    }


}
