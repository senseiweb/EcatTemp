using System;
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
        public EcatContext() : base("EcatSqlServer")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<EcatContext, EcatCtxConfig>());
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

            mb.Ignore<Academy>();
            mb.Ignore<AcademyCategory>();
            mb.Ignore<SanitizedSpComment>();
            mb.Ignore<SanitizedSpResponse>();
           

            mb.Properties<DateTime>()
                .Configure(c => c.HasColumnType("datetime2"));

            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
                .Where(type => type.IsClass && type.Namespace == "Ecat.Shared.DbMgr.Config");

            foreach (var configurationInstance in typesToRegister.Select(Activator.CreateInstance))
            {
                mb.Configurations.Add((dynamic)configurationInstance);
            }
        }

        #region ModelOwner: Cog

        public IDbSet<CogResponse> CogResponses { get; set; }
        public IDbSet<CogResult> CogResults { get; set; }

        #endregion

        #region ModelOwner: Common

        public IDbSet<AcademyCategory> AcademyCategories { get; set; }

        #endregion

        #region ModelOwner: Deisgner

        public IDbSet<AssessMap> AssessMaps { get; set; }
        public IDbSet<SpAssessMap> SpAssessMaps { get; set; }
        public IDbSet<CogInstrument> CogInstruments { get; set; }
        public IDbSet<CogInventory> CogInventories { get; set; }
        public IDbSet<KcInstrument> KcInstruments { get; set; }
        public IDbSet<KcInventory> KcInventories { get; set; }
        public IDbSet<SpInstrument> SpInstruments { get; set; }
        public IDbSet<SpInventory> SpInventories { get; set; }

        #endregion

        #region ModelOwner: Faculty

        public IDbSet<FacSpResponse> FacSpResponses { get; set; }
        public IDbSet<FacSpComment> FacSpComments { get; set; }
        public IDbSet<FacStratResponse> FacStratResponses { get; set; }

        #endregion

        #region ModelOwner: Headquarters

        public IDbSet<ActionItem> ActionItems { get; set; }
        public IDbSet<Decision> Decisions { get; set; }
        public IDbSet<Discussion> Discussions { get; set; }
        public IDbSet<Meeting> Meetings { get; set; }

        #endregion

        #region ModelOwner: School

        public IDbSet<StudentInCourse> StudentInCourses { get; set; }
        public IDbSet<FacultyInCourse> FacultyInCourses { get; set; }
        public IDbSet<Course> Courses { get; set; }
        public IDbSet<CrseStudentInGroup> StudentInGroups { get; set; }
        public IDbSet<WorkGroup> WorkGroups { get; set; }

        #endregion

        #region ModelOwner: Student

        public DbSet<SpResponse> SpResponses { get; set; }
        public DbSet<SpResult> SpResults { get; set; }
        public DbSet<SpComment> SpComments { get; set; }
        public DbSet<StratResponse> SpStratResponses { get; set; }
        public DbSet<StratResult> SpStratResults { get; set; }
        public DbSet<KcResponse> KcResponses { get; set; }
        public DbSet<KcResult> KcResults { get; set; }

        #endregion

        #region ModelOwner: User

        public IDbSet<Person> People { get; set; }
        public IDbSet<ProfileStudent> Students { get; set; }
        public IDbSet<ProfileExternal> Externals { get; set; }
        public IDbSet<ProfileFaculty> Faculty { get; set; }
        public IDbSet<Security> Securities { get; set; }

        #endregion


        internal sealed class EcatCtxConfig : DbMigrationsConfiguration<EcatContext>
        {
            public EcatCtxConfig()
            {
                AutomaticMigrationDataLossAllowed = true;
                AutomaticMigrationsEnabled = true;
            }
        }
    }
}
