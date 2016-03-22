using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Learner;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigStratResult : EntityTypeConfiguration<StratResult>
    {
        public ConfigStratResult()
        {
            HasKey(p => new {p.StudentId, p.CourseId, p.WorkGroupId});

            Ignore(p => p.StratResponses);
            Ignore(p => p.FacStrat);

        }
    }
}
