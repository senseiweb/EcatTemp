using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigSpInstrument : EntityTypeConfiguration<SpInstrument>
    {
        public ConfigSpInstrument()
        {
            Property(p => p.InstructorInstructions).IsMaxLength();
            Property(p => p.SelfInstructions).IsMaxLength();
            Property(p => p.PeerInstructions).IsMaxLength();
            HasRequired(p => p.ModifiedBy)
                .WithMany()
                .HasForeignKey(p => p.ModifiedById)
                .WillCascadeOnDelete(false);
        }
    }

    internal class ConfigKcInstrument : EntityTypeConfiguration<KcInstrument>
    {
        public ConfigKcInstrument()
        {
            Property(p => p.Instructions).IsMaxLength();

            HasRequired(p => p.ModifiedBy)
                .WithMany()
                .HasForeignKey(p => p.ModifiedById)
                .WillCascadeOnDelete(false);
        }
    }

    internal class ConfigCogInstrument : EntityTypeConfiguration<CogInstrument>
    {
        public ConfigCogInstrument()
        {
            Property(p => p.CogInstructions).IsMaxLength();
            HasRequired(p => p.ModifiedBy)
                .WithMany()
                .HasForeignKey(p => p.ModifiedById)
                .WillCascadeOnDelete(false);
        }
    }
}
