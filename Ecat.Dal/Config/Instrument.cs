using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigSpInstrument : EntityTypeConfiguration<SpInstrument>
    {
        public ConfigSpInstrument()
        {
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
            HasRequired(p => p.ModifiedBy)
                .WithMany()
                .HasForeignKey(p => p.ModifiedById)
                .WillCascadeOnDelete(false);
        }
    }
}
