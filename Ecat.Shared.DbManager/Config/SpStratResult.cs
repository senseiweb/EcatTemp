using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
{
    public class ConfigSpStratResult : EntityTypeConfiguration<SpStratResult>
    {
        public ConfigSpStratResult()
        {
            HasRequired(p => p.GrpMember)
                .WithMany(p => p.StratResults)
                .HasForeignKey(p => p.GrpMemberId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.FacStrat)
               .WithOptional(p => p.StratResult)
               .WillCascadeOnDelete(false);
        }
    }
}
