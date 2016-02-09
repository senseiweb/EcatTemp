using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
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
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueEmailAddress") { IsUnique = true }));

            Property(p => p.MpGender).IsRequired();
            Property(p => p.MpInstituteRole).IsRequired();
            HasOptional(p => p.Student).WithRequired(p => p.Person);
            HasOptional(p => p.Security).WithRequired(p => p.Person);
            HasOptional(p => p.External).WithRequired(p => p.Person);
            HasOptional(p => p.Facilitator).WithRequired(p => p.Person);
            Property(p => p.BbUserId)
                .HasMaxLength(20);
        }
    }

    public class ConfigPersonProfile : EntityTypeConfiguration<Profile>
    {
        public ConfigPersonProfile()
        {
            HasKey(p => p.PersonId);
        }
    }

    public class ConfigPersonSecurity : EntityTypeConfiguration<Security>
    {
        public ConfigPersonSecurity()
        {
            HasKey(p => p.PersonId);

        }
    }
}
