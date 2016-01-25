using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    internal class ConfigPerson : EntityTypeConfiguration<EcPerson>
    {
        public ConfigPerson()
        {
            HasKey(p => p.PersonId);
            Property(p => p.LastName).IsRequired();
            Property(p => p.FirstName).IsRequired();
            Property(p => p.MpMilAffiliation).IsRequired();
            Property(p => p.MpMilComponent).IsRequired();
            Property(p => p.MpMilPaygrade).IsRequired();
            Property(p => p.Email)
                .IsRequired()
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueEmailAddress") { IsUnique = true })); 

            Property(p => p.MpGender).IsRequired();
            Property(p => p.MpInstituteRole).IsRequired();
            HasOptional(p => p.Student).WithRequired(p => p.Person);
            HasOptional(p => p.Facilitator).WithRequired(p => p.Person);
            Property(p => p.BbUserId)
                .HasMaxLength(20);
            HasOptional(p => p.ModifiedBy)
                .WithMany()
                .HasForeignKey(p => p.ModifiedById)
                .WillCascadeOnDelete(false);
        }
    }

    internal class ConfigPersonStudentProfile : EntityTypeConfiguration<EcStudent>
    {
        public ConfigPersonStudentProfile()
        {
            HasRequired(p => p.Person).WithOptional(p => p.Student);
            HasKey(p => p.PersonId);
            Property(p => p.HomeStation).IsRequired().HasMaxLength(50);
            Property(p => p.UnitCommander).IsRequired().HasMaxLength(100);
            Property(p => p.UnitCommanderEmail).IsRequired().HasMaxLength(50);
            Property(p => p.UnitFirstSergeant).IsRequired().HasMaxLength(100);
            Property(p => p.UnitFirstSergeantEmail).IsRequired().HasMaxLength(50);
            Property(p => p.ContactNumber).HasMaxLength(15);
            Property(p => p.Bio).HasMaxLength(3000);
            Property(p => p.PersonId).HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

        }
    }

    internal class ConfigPersonInstructorProfile : EntityTypeConfiguration<EcFacilitator>
    {
        public ConfigPersonInstructorProfile()
        {
            HasRequired(p => p.Person).WithOptional(p => p.Facilitator);
            Property(p => p.Bio).HasMaxLength(3000);
            HasKey(p => p.PersonId);
            Property(p => p.PersonId).HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);
        }
    }


    internal class ConfigPersonSecurity : EntityTypeConfiguration<EcSecurity>
    {
        public ConfigPersonSecurity()
        {
            HasRequired(p => p.Person).WithOptional(p => p.Security);
            HasKey(p => p.PersonId);
            Property(p => p.PersonId).HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);
        }
    }

    internal class ConfigPersonExternal : EntityTypeConfiguration<EcExternal>
    {
        public ConfigPersonExternal()
        {
            HasRequired(p => p.Person).WithOptional(p => p.External);
            Property(p => p.Bio).HasMaxLength(3000);
            HasKey(p => p.PersonId);
            Property(p => p.PersonId).HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

        }
    }

}
