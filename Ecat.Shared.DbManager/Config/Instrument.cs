﻿using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
{
    public class ConfigSpInstrument : EntityTypeConfiguration<SpInstrument>
    {
        public ConfigSpInstrument()
        {
            Property(p => p.FacilitatorInstructions).IsMaxLength();
            Property(p => p.SelfInstructions).IsMaxLength();
            Property(p => p.PeerInstructions).IsMaxLength();
            HasMany(p => p.AssignedGroups)
                .WithOptional(p => p.AssignedSpInstr)
                .HasForeignKey(p => p.AssignedSpInstrId)
                .WillCascadeOnDelete(false);
        }
    }

    public class ConfigKcInstrument : EntityTypeConfiguration<KcInstrument>
    {
        public ConfigKcInstrument()
        {
            Property(p => p.Instructions).IsMaxLength();
            HasMany(p => p.AssignedGroups)
                .WithOptional(p => p.AssignedKcInstr)
                .HasForeignKey(p => p.AssignedKcInstrId)
                .WillCascadeOnDelete(false);
        }
    }


    public class ConfigCogInstrument : EntityTypeConfiguration<CogInstrument>
    {
        public ConfigCogInstrument()
        {
            Property(p => p.CogInstructions).IsMaxLength();
            //HasMany(p => p.AssignedGroups)
            //    .WithOptional(p => p.)
            //    .HasForeignKey(p => p.AssignedKcInstrId)
            //    .WillCascadeOnDelete(false);

        }
    }
}
