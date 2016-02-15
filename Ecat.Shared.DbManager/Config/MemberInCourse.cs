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
    public class ConfigMemberInCourse : EntityTypeConfiguration<MemberInCourse>
    {
        public ConfigMemberInCourse()
        {
            Property(p => p.CourseId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueCourseMember", 1) { IsUnique = true }));

            Property(p => p.PersonId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueCourseMember", 2) { IsUnique = true }));

            HasRequired(p => p.Person)
                .WithMany()
                .HasForeignKey(p => p.PersonId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Course)
                .WithMany(p => p.CourseMembers)
                .WillCascadeOnDelete(false);
        }
    }
}
