using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigCogResponse : EntityTypeConfiguration<CogResponse>
    {
        public ConfigCogResponse()
        {
            HasOptional(p => p.DeletedBy)
                .WithMany()
                .HasForeignKey(p => p.DeletedById);
        }
    }
}
