using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Context
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

            mb.Properties<DateTime>()
                .Configure(c => c.HasColumnType("datetime2"));

            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
             .Where(type => type.IsClass && type.Namespace == "Ecat.Shared.DbManager.Config");

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

        #region ModelOwner: Facilitator
   
        public IDbSet<FacSpAssessResponse> FacSpAssessResponses { get; set; }
        public IDbSet<FacSpComment> FacSpComments { get; set; }
        public IDbSet<FacSpStratResponse> FacSpStratResponses { get; set; }
        #endregion

        #region ModelOwner: Headquarters

        public IDbSet<ActionItem> ActionItems { get; set; }
        public IDbSet<Decision> Decisions { get; set; }
        public IDbSet<Discussion> Discussions { get; set; }
        public IDbSet<Meeting> Meetings { get; set; }
        #endregion

        #region ModelOwner: School
        public IDbSet<MemberInCourse> MemberInCourses { get; set; }
        public IDbSet<Course> Courses { get; set; }
        public IDbSet<MemberInGroup> MemberInGroups { get; set; }
        public IDbSet<WorkGroup> WorkGroups { get; set; }
        #endregion

        #region ModelOwner: Student
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
        public IDbSet<KcResponse> KcResponses { get; set; }
        public IDbSet<KcResult> KcResults { get; set; }
        #endregion

        #region ModelOwner: User
        public IDbSet<Person> People { get; set; }
        public IDbSet<Model.Student> Students { get; set; }
        public IDbSet<External> Externals { get; set; }
        public IDbSet<Facilitator> Facilitators { get; set; }
        public IDbSet<Security> Securities { get; set; }
        #endregion
    }

    internal sealed class EcatCtxConfig : DbMigrationsConfiguration<EcatContext>
    {
        public EcatCtxConfig()
        {
            AutomaticMigrationDataLossAllowed = true;
            AutomaticMigrationsEnabled = true;
        }
    }
}
