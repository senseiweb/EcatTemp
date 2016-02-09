using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Model;

namespace Ecat.Shared.Core.Config
{
    public class ConfigSpComment : EntityTypeConfiguration<SpComment>
    {
        public ConfigSpComment()
        {
            HasRequired(p => p.Author)
             .WithMany(p => p.AuthorOfComments)
             .HasForeignKey(p => p.AuthorId)
             .WillCascadeOnDelete(false);

            HasRequired(p => p.Recipient)
               .WithMany(p => p.RecipientOfComments)
               .HasForeignKey(p => p.RecipientId)
               .WillCascadeOnDelete(false);

        }
    }
}
