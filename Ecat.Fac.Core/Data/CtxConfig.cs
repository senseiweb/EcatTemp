using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Model;

// ReSharper disable once CheckNamespace
namespace Ecat.Fac.Core.Data.Config
{
    internal class ConfigStudSpInstrument : EntityTypeConfiguration<SpInstrument>
    {
        public ConfigStudSpInstrument()
        {
            Ignore(p => p.Version);
            Ignore(p => p.SelfInstructions);
            Ignore(p => p.PeerInstructions);
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
        }
    }

    internal class ConfigStudWrkGrp : EntityTypeConfiguration<WorkGroup>
    {
        public ConfigStudWrkGrp()
        {
            Ignore(p => p.MaxStrat);
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
