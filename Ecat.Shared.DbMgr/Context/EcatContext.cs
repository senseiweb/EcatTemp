﻿using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using Ecat.Shared.Core.ModelLibrary.Cognitive;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.Staff.MeetingTaker;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.Shared.DbMgr.Context
{
    public class EcatContext : DbContext
    {
        public EcatContext() : base("ecat")
        {
            Database.SetInitializer<EcatContext>(null);
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder mb)
        {
            Database.Log = s => Debug.WriteLine(s);

            mb.Conventions.Remove<PluralizingTableNameConvention>();

            mb.Properties<string>().Configure(s => s.HasMaxLength(50));

            mb.Properties()
                .Where(p => p.Name.StartsWith("Mp") || p.Name.StartsWith("En"))
                .Configure(x => x.HasColumnName(x.ClrPropertyInfo.Name.Substring(2)));

            mb.Types()
                .Where(type => type.Name.StartsWith("Ec"))
                .Configure(type => type.ToTable(type.ClrType.Name.Substring(2)));

            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
                .Where(type => type.IsClass && type.Namespace == "Ecat.Shared.DbMgr.Config");

            foreach (var configurationInstance in typesToRegister.Select(Activator.CreateInstance))
            {
                mb.Configurations.Add((dynamic)configurationInstance);
            }

            mb.Properties<DateTime>()
                .Configure(c => c.HasColumnType("datetime2"));

            mb.Ignore<Academy>();
            mb.Ignore<AcademyCategory>();
            mb.Ignore<SanitizedSpComment>();
            mb.Ignore<SanitizedSpResponse>();
            mb.Ignore<CourseReconResult>();
            mb.Ignore<MemReconResult>();
            mb.Ignore<GroupMemReconResult>();
            mb.Ignore<GroupReconResult>();
            mb.Entity<FacultyInCourse>().Ignore(p => p.ReconResultId);
            mb.Entity<StudentInCourse>().Ignore(p => p.ReconResultId);
            mb.Entity<CrseStudentInGroup>().Ignore(p => p.ReconResultId);
            mb.Entity<WorkGroup>().Ignore(p => p.ReconResultId);
            mb.Entity<Course>().Ignore(p => p.ReconResultId);


        }

        #region ModelOwner: Cog

        public DbSet<CogResponse> CogResponses { get; set; }
        public DbSet<CogResult> CogResults { get; set; }

        #endregion

        #region ModelOwner: Common

        public DbSet<AcademyCategory> AcademyCategories { get; set; }

        #endregion

        #region ModelOwner: Deisgner

        //public DbSet<AssessMap> AssessMaps { get; set; }
        //public DbSet<SpAssessMap> SpAssessMaps { get; set; }
        public DbSet<CogInstrument> CogInstruments { get; set; }
        public DbSet<CogInventory> CogInventories { get; set; }
        public DbSet<KcInstrument> KcInstruments { get; set; }
        public DbSet<KcInventory> KcInventories { get; set; }
        public DbSet<SpInstrument> SpInstruments { get; set; }
        public DbSet<SpInventory> SpInventories { get; set; }
        public DbSet<WorkGroupModel> WgModels { get; set; }
        #endregion

        #region ModelOwner: Faculty

        public DbSet<FacSpResponse> FacSpResponses { get; set; }
        public DbSet<FacSpComment> FacSpComments { get; set; }
        public DbSet<FacStratResponse> FacStratResponses { get; set; }

        #endregion

        #region ModelOwner: Headquarters

        public DbSet<ActionItem> ActionItems { get; set; }
        public DbSet<Decision> Decisions { get; set; }
        public DbSet<Discussion> Discussions { get; set; }
        public DbSet<Meeting> Meetings { get; set; }

        #endregion

        #region ModelOwner: School

        public DbSet<StudentInCourse> StudentInCourses { get; set; }
        public DbSet<FacultyInCourse> FacultyInCourses { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CrseStudentInGroup> StudentInGroups { get; set; }
        public DbSet<WorkGroup> WorkGroups { get; set; }

        #endregion

        #region ModelOwner: Student

        public DbSet<SpResponse> SpResponses { get; set; }
        public DbSet<SpResult> SpResults { get; set; }
        public DbSet<StudSpComment> StudSpComments { get; set; }
        public DbSet<StratResponse> SpStratResponses { get; set; }
        public DbSet<StratResult> SpStratResults { get; set; }
        public DbSet<KcResponse> KcResponses { get; set; }
        public DbSet<KcResult> KcResults { get; set; }

        #endregion

        #region ModelOwner: User

        public DbSet<Person> People { get; set; }
        public DbSet<ProfileStudent> Students { get; set; }
        public DbSet<ProfileExternal> Externals { get; set; }
        public DbSet<ProfileFaculty> Faculty { get; set; }
        public DbSet<Security> Securities { get; set; }

        #endregion


        internal sealed class EcatCtxConfig : DbMigrationsConfiguration<EcatContext>
        {
            public EcatCtxConfig()
            {
                AutomaticMigrationDataLossAllowed = false;
                AutomaticMigrationsEnabled = true;
            }
        }
    }
}
