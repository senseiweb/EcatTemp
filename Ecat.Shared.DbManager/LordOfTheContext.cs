﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Model;
using Ecat.Student.Core.Interface;
using Ecat.Student.Data.Interface;
using Ecat.Student.Data.Model;
using Ecat.Student.Data.Model.RefOnly;

namespace Ecat.Shared.DbManager
{
    public class LordOfTheContext : DbContext, IStudOpsContext
    {
        public LordOfTheContext() : base("EcatSqlServer")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<LordOfTheContext, RuleThemAllConfig>());
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder mb)
        {
            Database.Log = s => Debug.WriteLine(s);

            mb.Conventions.Remove<PluralizingTableNameConvention>();

            mb.Ignore<StudInGroup>();

            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
             .Where(type => type.IsClass && type.Namespace == "Ecat.Shared.DbManager.Configs");

            foreach (var configurationInstance in typesToRegister.Select(Activator.CreateInstance))
            {
                mb.Configurations.Add((dynamic)configurationInstance);
            }
            base.OnModelCreating(mb);
        }

        public IDbSet<Person> People { get; set; }
        public IDbSet<Core.Model.Student> Students { get; set; }
        public IDbSet<External> Externals { get; set; }
        public IDbSet<Facilitator> Facilitators { get; set; }
        public IDbSet<Security> Securities { get; set; }
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
        public IDbSet<MemberInCourse> MemberInCourses { get; set; }
        public IDbSet<Course> Courses { get; set; }
        public IDbSet<MemberInGroup> MemberInGroups { get; set; }
        public IDbSet<Academy> Academies { get; set; }
        public IDbSet<WorkGroup> WorkGroups { get; set; }

    }

    internal sealed class RuleThemAllConfig : DbMigrationsConfiguration<LordOfTheContext>
    {
        public RuleThemAllConfig()
        {
            AutomaticMigrationDataLossAllowed = true;
            AutomaticMigrationsEnabled = true;
        }
    }
}
