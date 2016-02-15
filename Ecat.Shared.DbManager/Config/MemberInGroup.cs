using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
{
    public class ConfigMemberInGroup : EntityTypeConfiguration<MemberInGroup>
    {
        public ConfigMemberInGroup()
        {
            Property(p => p.GroupId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueGroupMember", 1) { IsUnique = true }));

            Property(p => p.CourseEnrollmentId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueGroupMember", 2) { IsUnique = true }));

            HasRequired(p => p.CourseEnrollment)
                .WithMany(p => p.StudGroupEnrollments)
                .HasForeignKey(p => p.CourseEnrollmentId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Student)
                .WithMany(p => p.GroupPersonas)
                .HasForeignKey(p => p.StudentId)
                .WillCascadeOnDelete(false);

            HasMany(p => p.GroupPeers)
               .WithRequired()
               .HasForeignKey(p => p.GroupId)
               .WillCascadeOnDelete(false);
        }
    }
}
