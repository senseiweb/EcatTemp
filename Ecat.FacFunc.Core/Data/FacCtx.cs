using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.DbMgr.Config;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.FacFunc.Core.Data
{
    public class FacCtx : ContextBase<FacCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {

            mb.Configurations.Add(new ConfigSpResponse());
            mb.Configurations.Add(new ConfigSpResult());
            mb.Configurations.Add(new ConfigSpComment());
            mb.Configurations.Add(new ConfigFacSpResponse());
            mb.Configurations.Add(new ConfigCrseStudInGroup());
            mb.Configurations.Add(new ConfigFacultyInCourse());
            mb.Configurations.Add(new ConfigStudentInCourse());
            mb.Configurations.Add(new ConfigProfile());

            mb.Ignore(new List<Type>
            {
                typeof (ProfileExternal),
                typeof (ProfileStaff),
                typeof (Security),
                typeof (ProfileStaff)
            });

            mb.Types()
            .Where(t => typeof(IAuditable).IsAssignableFrom(t))
            .Configure(p => p.Ignore("ModifiedById"));

            mb.Types()
            .Where(t => typeof(IAuditable).IsAssignableFrom(t))
            .Configure(p => p.Ignore("ModifiedDate"));

            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
             .Where(type => type.IsClass && type.Namespace == "Ecat.FacFunc.Core.Data.Config");

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
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpResult> SpResults { get; set; }
        public IDbSet<StratResult> SpStratResults { get; set; }
    }

}
