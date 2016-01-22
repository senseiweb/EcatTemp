using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigCourse : EntityTypeConfiguration<EcCourse>
    {
        public ConfigCourse()
        {
            Property(p => p.BbCourseId)
             .HasMaxLength(60)
             .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                 new IndexAnnotation(new IndexAttribute("IX_UniqueBbCourseId") { IsUnique = true }));
            
        }
    }
}
