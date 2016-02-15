using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Ecat.Shared.Model;

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
            mb.Conventions.Remove<PluralizingTableNameConvention>();

            mb.Properties<string>().Configure(s => s.HasMaxLength(50));

            mb.Properties()
                .Where(p => p.Name.StartsWith("Mp") || p.Name.StartsWith("En"))
                .Configure(x => x.HasColumnName(x.ClrPropertyInfo.Name.Substring(2)));

            mb.Types()
                .Where(type => type.Name.StartsWith("Ec"))
                .Configure(type => type.ToTable(type.ClrType.Name.Substring(2)));

            mb.Ignore<Academy>();

            mb.Ignore<AcademyCategory>();

            mb.Properties<DateTime>()
                .Configure(c => c.HasColumnType("datetime2"));

        }
    }


}
