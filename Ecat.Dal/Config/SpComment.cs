using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigSpComment : EntityTypeConfiguration<SpComment>
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

            HasRequired(p => p.ModifiedBy)
              .WithMany()
              .HasForeignKey(p => p.ModifiedById);

            HasOptional(p => p.DeletedBy)
                .WithMany()
                .HasForeignKey(p => p.DeletedById);
        }
    }
}
