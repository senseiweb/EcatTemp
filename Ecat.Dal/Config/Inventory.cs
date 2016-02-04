using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigSpInventory : EntityTypeConfiguration<SpInventory>
    {
        public ConfigSpInventory()
        {
            Property(p => p.InstructorBehavior).HasMaxLength(6000);
            Property(p => p.PeerBehavior).HasMaxLength(6000);
            Property(p => p.SelfBehavior).HasMaxLength(6000);
            HasRequired(p => p.ModifiedBy)
              .WithMany()
              .HasForeignKey(p => p.ModifiedById)
               .WillCascadeOnDelete(false);

        }
    }

    internal class ConfigKcInventory : EntityTypeConfiguration<KcInventory>
    {
        public ConfigKcInventory()
        {
            HasRequired(p => p.ModifiedBy)
              .WithMany()
              .HasForeignKey(p => p.ModifiedById)
               .WillCascadeOnDelete(false);
        }
    }


    internal class ConfigCogInventory : EntityTypeConfiguration<CogInventory>
    {
        public ConfigCogInventory()
        {
            HasRequired(p => p.ModifiedBy)
              .WithMany()
              .HasForeignKey(p => p.ModifiedById)
               .WillCascadeOnDelete(false);


        }
    }
}
