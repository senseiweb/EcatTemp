using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Model;

namespace Ecat.Shared.Core.Config
{
    internal class ConfigSpAssessResponse : EntityTypeConfiguration<SpAssessResponse>
    {
        public ConfigSpAssessResponse()
        {
            ToTable(MpTableNames.SpAssessResp);

            HasRequired(p => p.Assessor)
                .WithMany(p => p.AssessorSpResponses)
                .HasForeignKey(p => p.AssessorId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Assessee)
               .WithMany(p => p.AssesseeSpResponses)
               .HasForeignKey(p => p.AssesseeId)
               .WillCascadeOnDelete(false);

            HasRequired(p => p.InventoryItem)
                .WithMany()
                .HasForeignKey(p => p.InventoryItemId)
                .WillCascadeOnDelete(false);

            Property(p => p.AssessorId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueSpResponse", 1) { IsUnique = true }));

            Property(p => p.AssesseeId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueSpResponse", 2) { IsUnique = true }));

            Property(p => p.InventoryItemId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueSpResponse", 3) { IsUnique = true }));
        }
    }
}
