using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigSpAssessResponse : EntityTypeConfiguration<SpAssessResponse>
    {
        public ConfigSpAssessResponse()
        {
            HasRequired(p => p.Assessor)
                .WithMany(p => p.AssessorSpResponses)
                .HasForeignKey(p => p.AssessorId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Assessee)
               .WithMany(p => p.AssesseeSpResponses)
               .HasForeignKey(p => p.AssesseeId)
               .WillCascadeOnDelete(false);

            Property(p => p.AssessorId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueSpResponse", 1) { IsUnique = true }));

            Property(p => p.AssesseeId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueSpResponse", 2) { IsUnique = true }));

            HasRequired(p => p.ModifiedBy)
              .WithMany()
              .HasForeignKey(p => p.ModifiedById)
              .WillCascadeOnDelete(false);

            HasOptional(p => p.DeletedBy)
                .WithMany()
                .HasForeignKey(p => p.DeletedById)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.RelatedInventory)
                .WithMany(p => p.Responses)
                .WillCascadeOnDelete(false);
        }
    }
}
