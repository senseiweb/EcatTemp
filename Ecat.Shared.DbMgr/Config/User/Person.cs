using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigPerson : EntityTypeConfiguration<Person>
    {
        public ConfigPerson()
        {
            HasKey(p => p.PersonId);
            Property(p => p.LastName).IsRequired();
            Property(p => p.FirstName).IsRequired();
            Property(p => p.MpAffiliation).IsRequired();
            Property(p => p.MpComponent).IsRequired();
            Property(p => p.MpPaygrade).IsRequired();
            Property(p => p.Email)
                .IsRequired()
                .HasMaxLength(80)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueEmailAddress") { IsUnique = true }));

            Property(p => p.MpGender).IsRequired();
            Property(p => p.MpInstituteRole).IsRequired();
            
            HasOptional(p => p.Profile)
                .WithRequired(p => p.Person)
                .WillCascadeOnDelete(true);

            HasOptional(p => p.External)
                .WithRequired()
                .WillCascadeOnDelete(false);

            HasOptional(p => p.HqStaff)
                .WithRequired()
                .WillCascadeOnDelete(false);

            HasOptional(p => p.Student)
                .WithRequired()
               .WillCascadeOnDelete(false);

            HasOptional(p => p.Faculty)
                .WithRequired()
                .WillCascadeOnDelete(false);

            HasOptional(p => p.Designer)
                .WithRequired()
                .WillCascadeOnDelete(false);
        }
    }

   
}
