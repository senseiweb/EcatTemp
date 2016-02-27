using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.FacMod.Core
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
