using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Reflection;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.DbMgr.Config;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.FacMod.Core
{
    public class FacCtx : ContextBase<FacCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {

            mb.Configurations.Add(new ConfigSpResponse());
            mb.Configurations.Add(new ConfigSpResult());
            mb.Configurations.Add(new ConfigStratResponse());
            mb.Configurations.Add(new ConfigStratResult());
            mb.Configurations.Add(new ConfigSpComment());
            mb.Configurations.Add(new ConfigFacSpCommentFlag());
            mb.Configurations.Add(new ConfigSpCommentFlag());
            mb.Configurations.Add(new ConfigFacSpResponse());
            mb.Configurations.Add(new ConfigFacStratResponse());
            mb.Configurations.Add(new ConfigFacSpComment());
            mb.Configurations.Add(new ConfigCrseStudInGroup());
            mb.Configurations.Add(new ConfigFacultyInCourse());
            mb.Configurations.Add(new ConfigStudentInCourse());

            mb.Ignore(new List<Type>
            {
               typeof (ProfileExternal),
                typeof (Security),
                typeof (ProfileStaff),
                typeof(KcResponse),
                typeof(KcResult)
            });

            mb.Types()
               .Where(t => typeof(IAuditable).IsAssignableFrom(t))
               .Configure(p => p.Ignore("ModifiedById"));

            mb.Types()
                .Where(t => typeof(IAuditable).IsAssignableFrom(t))
                .Configure(p => p.Ignore("ModifiedDate"));

            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
                .Where(type => !string.IsNullOrEmpty(type.Namespace))
                .Where(type => type.BaseType != null && type.BaseType.IsGenericType && type.BaseType.GetGenericTypeDefinition() == typeof(EntityTypeConfiguration<>));

            foreach (var configurationInstance in typesToRegister.Select(Activator.CreateInstance))
            {
                mb.Configurations.Add((dynamic)configurationInstance);
            }

            base.OnModelCreating(mb);
        }

        public IDbSet<WorkGroup> WorkGroups { get; set; }
        public IDbSet<Course> Courses { get; set; }
        public IDbSet<CrseStudentInGroup> CrseStudentInGroups { get; set; }
        public IDbSet<StudentInCourse> StudentInCourses { get; set; }
        public IDbSet<FacultyInCourse> FacultyInCourses { get; set; }
        public IDbSet<FacSpResponse> FacSpResponses { get; set; }
        public IDbSet<SpResponse> SpResponses { get; set; }
        public IDbSet<FacStratResponse> FacStratResponses { get; set; }
        public IDbSet<StratResponse> StratResponses { get; set; }
        public IDbSet<FacSpComment> FacSpComments { get; set; }
        public IDbSet<StudSpComment> StudSpComments { get; set; }
        public IDbSet<SpResult> SpResults { get; set; }
        public IDbSet<StratResult> SpStratResults { get; set; }
    }

}
