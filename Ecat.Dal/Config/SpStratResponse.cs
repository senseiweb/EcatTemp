using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigSpStratResponse : EntityTypeConfiguration<SpStratResponse>
    {
        public ConfigSpStratResponse()
        {

            HasRequired(p => p.Assessor)
                .WithMany(p => p.AssessorStratResponse)
                .HasForeignKey(p => p.AssessorId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Assessee)
               .WithMany(p => p.AssesseeStratResponse)
               .HasForeignKey(p => p.AssesseeId)
               .WillCascadeOnDelete(false);

            Property(p => p.AssessorId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueStratResponse", 1) { IsUnique = true }));

            Property(p => p.AssesseeId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                new IndexAnnotation(new IndexAttribute("IX_UniqueStratResponse", 2) { IsUnique = true }));

            //Add index for unique combination of assessor's GroupMemberId and StratPosition
            Property(p => p.AssessorId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                new IndexAnnotation(new IndexAttribute("IX_AssessorUniqueStratsInGroup", 1) { IsUnique = true }));

            Property(p => p.StratPosition)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                new IndexAnnotation(new IndexAttribute("IX_AssessorUniqueStratsInGroup", 2) { IsUnique = true }));

            HasRequired(p => p.ModifiedBy)
            .WithMany()
            .HasForeignKey(p => p.ModifiedById);
        }
    }
}
