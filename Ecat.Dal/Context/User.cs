using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Ecat.Models;

namespace Ecat.Dal.Context
{
    public class UserCtx : EcatCtx
    {
        public UserCtx() 
        {
            Database.SetInitializer<UserCtx>(null);
        }

        /// <summary>
        /// This method is called when the model for a derived context has been initialized, but
        ///             before the model has been locked down and used to initialize the context.  The default
        ///             implementation of this method does nothing, but it can be overridden in a derived class
        ///             such that the model can be further configured before it is locked down.
        /// </summary>
        /// <remarks>
        /// Typically, this method is called only once when the first instance of a derived context
        ///             is created.  The model for that context is then cached and is for all further instances of
        ///             the context in the app domain.  This caching can be disabled by setting the ModelCaching
        ///             property on the given ModelBuidler, but note that this can seriously degrade performance.
        ///             More control over caching is provided through use of the DbModelBuilder and DbContextFactory
        ///             classes directly.
        /// </remarks>
        /// <param name="mb">The builder that defines the model for the context being created. </param>
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            mb.Conventions.Remove<PluralizingTableNameConvention>();

            mb.Properties<string>().Configure(s => s.HasMaxLength(250));

            mb.Properties<DateTime>()
                .Configure(c => c.HasColumnType("datetime2"));

            mb.Properties()
                .Where(p => p.Name.StartsWith("Mp"))
                .Configure(x => x.HasColumnName(x.ClrPropertyInfo.Name.Substring(2)));

            mb.Types()
                .Where(type => type.Name.StartsWith("Ec"))
                .Configure(type => type.ToTable(type.ClrType.Name.Substring(2)));

            mb.Entity<LoginToken>().HasKey(token => token.PersonId);

            mb.Ignore<EcAcademy>();
            mb.Ignore<EcCourse>();
            mb.Ignore<SpAssessResponse>();
            mb.Ignore<EcGroup>();
            mb.Ignore<EcCourseMember>();
            mb.Ignore<EcGroupMember>();
            mb.Ignore<SpInstrument>();
            mb.Ignore<KcInstrument>();
            mb.Ignore<CogInstrument>();
            mb.Ignore<SpInventory>();
            mb.Ignore<CogInventory>();
            mb.Ignore<KcInventory>();
            mb.Ignore<CogResponse>();
            mb.Ignore<CogResult>();
            mb.Ignore<KcResponse>();
            mb.Ignore<KcResult>();
            mb.Ignore<SpAssessResult>();
            mb.Ignore<SpComment>();
            mb.Ignore<SpStratResponse>();
            mb.Ignore<SpStratResult>();

            base.OnModelCreating(mb);
        }

        public DbSet<LoginToken> LoginToken { get; set; } 
    }
}
