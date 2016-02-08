using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Data;
using Ecat.Student.Core.Model;

namespace Ecat.StudentOps.Data
{
    public class StudOpsContext: BaseContext<StudOpsContext>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            mb.Conventions
            mb.HasDefaultSchema("student");
            base.OnModelCreating(mb);

        }

        public DbSet<SpAssessResponse> SpAssessResponses { get; set; }
    }
}
