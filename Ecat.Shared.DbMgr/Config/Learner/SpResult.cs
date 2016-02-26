using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Learner;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigSpResult : EntityTypeConfiguration<SpResult>
    {
        public ConfigSpResult()
        {
            HasKey(p => new {p.StudentId, p.CourseId, p.WorkGroupId});

            HasRequired(p => p.AssignedInstrument)
                .WithMany()
                .HasForeignKey(p => p.AssignedInstrumentId)
                .WillCascadeOnDelete(false);
                
       }
    }
}
