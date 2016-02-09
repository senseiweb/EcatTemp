using System.Data.Entity;
using Ecat.Shared.Core.Model;

namespace Ecat.Shared.DbManager.Context
{
    public class BaseContext<TContext> : DbContext where TContext: DbContext
    {
        static BaseContext()
        {
            Database.SetInitializer<TContext>(null);
        }
        
        protected BaseContext(): base("EcatSqlServer") { }

        public DbSet<Person> People { get; set; }
        public DbSet<Core.Model.Student> Students { get; set; }
        public DbSet<External> Externals { get; set; }
        public DbSet<Facilitator> Facilitators { get; set; }
        public DbSet<Security> Securities { get; set; }
    }


}
