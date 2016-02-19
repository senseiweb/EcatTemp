using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using Ecat.Shared.Core;
using Ecat.Shared.DbManager.Config;
using Ecat.Shared.Model;

namespace Ecat.Stud.Core.Data
{
    public class StudCtx: EcatBaseContext<StudCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {

            mb.Configurations.Add(new ConfigSpStratResponse());
            mb.Configurations.Add(new ConfigSpAssessResult());
            mb.Configurations.Add(new ConfigSpComment());
            mb.Configurations.Add(new ConfigSpAssessResponse());
            mb.Configurations.Add(new ConfigMemberInCourse());
            mb.Configurations.Add(new ConfigMemberInGroup());

            mb.Ignore(new List<Type>
            {
                typeof (External),
                typeof (Facilitator),
                typeof (Profile),
                typeof (External),
                typeof (Security),
                typeof (HqStaff),
                typeof (FacSpStratResponse),
            });

            mb.Types()
                .Where(t => typeof (IAuditable).IsAssignableFrom(t))
                .Configure(p => p.Ignore("ModifiedById"));

            mb.Types()
                .Where(t => typeof (IAuditable).IsAssignableFrom(t))
                .Configure(p => p.Ignore("ModifiedDate"));

            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
             .Where(type => type.IsClass && type.Namespace == "Ecat.Stud.Core.Data.Config");

            foreach (var configurationInstance in typesToRegister.Select(Activator.CreateInstance))
            {
                mb.Configurations.Add((dynamic)configurationInstance);
            }

            base.OnModelCreating(mb);
        }

        public IDbSet<WorkGroup> WorkGroups { get; set; }
        public IDbSet<Course> Courses { get; set; }
        public IDbSet<MemberInGroup> MemberInGroups { get; set; }
        public IDbSet<MemberInCourse> MemberInCourses { get; set; }
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
    }
}
