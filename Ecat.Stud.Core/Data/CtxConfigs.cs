using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Model;

// ReSharper disable once CheckNamespace
namespace Ecat.Stud.Core.Data.Config
{
    internal class ConfigStudSpInstrument : EntityTypeConfiguration<SpInstrument>
    {
        public ConfigStudSpInstrument()
        {
            Ignore(p => p.Version);
            Ignore(p => p.FacilitatorInstructions);
            Ignore(p => p.ModifiedById);
            Ignore(p => p.ModifiedDate);
            Property(p => p.SelfInstructions).IsMaxLength();
            Property(p => p.PeerInstructions).IsMaxLength();
            HasMany(p => p.AssignedGroups)
                .WithOptional(p => p.AssignedSpInstr)
                .HasForeignKey(p => p.AssignedSpInstrId);
        }
    }

    internal class ConfigStudSpInventory : EntityTypeConfiguration<SpInventory>
    {
        public ConfigStudSpInventory()
        {
            Ignore(p => p.IsScored);
            Ignore(p => p.ModifiedById);
            Ignore(p => p.ModifiedDate); 
        }
    }

    internal class ConfigStudWrkGrp : EntityTypeConfiguration<WorkGroup>
    {
        public ConfigStudWrkGrp()
        {
            Ignore(p => p.MaxStrat);
            Ignore(p => p.FacSpComments);
            Ignore(p => p.FacSpResponses);
            Ignore(p => p.FacStratResponses);
            Ignore(p => p.BbGroupId);
        }
    }

    internal class ConfigStudCrse : EntityTypeConfiguration<Course>
    {
        public ConfigStudCrse()
        {
            Ignore(p => p.BbCourseId);
        }
    }

    internal class ConfigStudStudent : EntityTypeConfiguration<Shared.Model.Student>
    {
        public ConfigStudStudent()
        {
            ToTable("Profile");
            Ignore(p => p.Commander);
            Ignore(p => p.CommanderEmail);
            Ignore(p => p.Shirt);
            Ignore(p => p.ShirtEmail);
            Ignore(p => p.ContactNumber);

            HasKey(p => p.PersonId)
                .HasRequired(p => p.Person)
                .WithOptional(p => p.Student);
        }
    }

    internal class ConfigStudPerson : EntityTypeConfiguration<Person>
    {
        public ConfigStudPerson()
        {
            Ignore(p => p.BbUserId);
            Ignore(p => p.IsActive);
            Ignore(p => p.ModifiedById);
            Ignore(p => p.MpInstituteRole);
        }
    }
}
