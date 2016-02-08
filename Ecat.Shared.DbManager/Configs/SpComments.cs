using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Student.Data.Model;

namespace Ecat.Shared.DbManager.Configs
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
