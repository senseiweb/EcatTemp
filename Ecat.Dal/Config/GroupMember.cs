using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigGroupMember : EntityTypeConfiguration<EcGroupMember>
    {
        public ConfigGroupMember()
        {

            Property(p => p.GroupId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueGroupMember", 1) { IsUnique = true }));

            Property(p => p.CourseEnrollmentId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueGroupMember", 2) { IsUnique = true }));

            HasRequired(p => p.ModifiedBy)
                .WithMany()
                .HasForeignKey(p => p.ModifiedById)
                .WillCascadeOnDelete(false);

            HasOptional(p => p.DeletedBy)
                .WithMany()
                .HasForeignKey(p => p.DeletedById)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.CourseEnrollment)
                .WithMany(p => p.GroupEnrollments)
                .HasForeignKey(p => p.CourseEnrollmentId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Person)
                .WithMany()
                .HasForeignKey(p => p.PersonId)
                .WillCascadeOnDelete(false);

            HasMany(p => p.GroupPeers)
               .WithRequired()
               .HasForeignKey(p => p.GroupId)
               .WillCascadeOnDelete(false);
        }
    }
}
