using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigCourseMember : EntityTypeConfiguration<EcCourseMember>
    {
        public ConfigCourseMember()
        {
            Property(p => p.CourseId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueCourseMember", 1) { IsUnique = true }));

            Property(p => p.PersonId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueCourseMember", 2) { IsUnique = true }));

            HasOptional(p => p.DeletedBy)
                .WithMany()
                .HasForeignKey(p => p.DeletedById);

            HasRequired(p => p.Person)
                .WithMany(p => p.Courses)
                .HasForeignKey(p => p.PersonId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Course)
                .WithMany(p => p.Members)
                .WillCascadeOnDelete(false);
        }
    }
}
