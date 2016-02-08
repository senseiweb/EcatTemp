using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Model;

namespace Ecat.Shared.Data
{
    public class BaseContext<TContext> : DbContext where TContext: DbContext
    {
        static BaseContext()
        {
            Database.SetInitializer<TContext>(null);
        }
        
        protected BaseContext(): base("EcatSqlServer") { }

        public DbSet<Person> People { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<External> Externals { get; set; }
        public DbSet<Facilitator> Facilitators { get; set; }
        public DbSet<Security> Securities { get; set; }
    }


}
