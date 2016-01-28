﻿using System;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure.Interception;
using System.Data.Entity.Migrations;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using Ecat.Models;

namespace Ecat.Dal.Context
{
    public class EcatCtx : DbContext
    {
        public EcatCtx() : base("EcatSqlServer")
        {
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<EcatCtx>());
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;

        }

        public EcatCtx(string connectionString) : base(connectionString)
        {
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<EcatCtx>());
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
            Database.Log = s => Debug.WriteLine(s);

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


            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
                .Where(type => type.IsClass && type.Namespace == "Ecat.Dal.Config");

            foreach (var configurationInstance in typesToRegister.Select(Activator.CreateInstance))
            {
                mb.Configurations.Add((dynamic) configurationInstance);
            }

            base.OnModelCreating(mb);

          }

        public virtual DbSet<EcAcademy> Academies { get; set; }
        public virtual DbSet<EcCourse> Courses { get; set; }
        public virtual DbSet<EcGroup> Groups { get; set; }
        public virtual DbSet<EcCourseMember> CourseMembers { get; set; }
        public virtual DbSet<EcGroupMember> GroupMembers { get; set; }
        public virtual DbSet<SpInstrument> SpInstruments { get; set; }
        public virtual DbSet<KcInstrument> KcInstruments { get; set; }
        public virtual DbSet<CogInstrument> CogInstruments { get; set; }

        public virtual DbSet<SpInventory> SpInventories { get; set; }
        public virtual DbSet<KcInventory> KcInventories { get; set; }
        public virtual DbSet<CogInventory> CogInventories { get; set; }

        public virtual DbSet<CogResponse> CognitiveResponses { get; set; }
        public virtual DbSet<CogResult> CognitiveResults { get; set; }
        public virtual DbSet<KcResponse> KnowCheckResponses { get; set; }
        public virtual DbSet<KcResult> KnowCheckResults { get; set; }
        public virtual DbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public virtual DbSet<SpAssessResult> SpAssessResults { get; set; }
        public virtual DbSet<SpComment> SpComments { get; set; }
        public virtual DbSet<SpStratResponse> StratResponses { get; set; }
        public virtual DbSet<SpStratResult> StratResults { get; set; }
        public virtual DbSet<EcPerson> Persons { get; set; }
        public virtual DbSet<EcSecurity> Securities { get; set; }

        public virtual DbSet<EcStudent> Students { get; set; }
        public virtual DbSet<EcFacilitator> Facilitators { get; set; }
        public virtual DbSet<EcExternal> Externals { get; set; }

    }

    internal sealed class MainConfig : DbMigrationsConfiguration<EcatCtx>
    {
        public MainConfig()
        {
            //TODO: Change to false before deployment
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(EcatCtx ctx)
        {
            var seed = new Seed();

            if (!seed.DoSeed)
            {
                return;
            }

            if (!Debugger.IsAttached) return;

            Debugger.Launch();

            try
            {
                SaveChanges(seed.PlantSeed(ctx));
            }
            catch (DbEntityValidationException ex)
            {
                foreach (var eve in ex.EntityValidationErrors)
                {
                    Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Debug.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }

                Debug.WriteLine(ex);
                throw;
            }
        }

        private static void SaveChanges(DbContext context)
        {
            try
            {
                context.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                var sb = new StringBuilder();

                foreach (var failure in ex.EntityValidationErrors)
                {
                    sb.AppendFormat("{0} failed validation\n", failure.Entry.Entity.GetType());
                    foreach (var error in failure.ValidationErrors)
                    {
                        sb.AppendFormat("- {0} : {1}", error.PropertyName, error.ErrorMessage);
                        sb.AppendLine();
                    }
                }

                throw new DbEntityValidationException("Entity Validation Failed - errors follow:\n" + sb.ToString(), ex);
                // Add the original exception as the innerException
            }
        }
    }

}
