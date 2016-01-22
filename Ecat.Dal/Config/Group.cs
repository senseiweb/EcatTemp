using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigGroup : EntityTypeConfiguration<EcGroup>
    {
        public ConfigGroup()
        {
            Property(p => p.CourseId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueCourseGroup", 1) { IsUnique = true }));

            Property(p => p.GroupNumber)
                .HasMaxLength(6)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueCourseGroup", 2) { IsUnique = true }));

            Property(p => p.MpCategory)
                .HasMaxLength(4)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueCourseGroup", 3) { IsUnique = true }));
        }
    }
}
