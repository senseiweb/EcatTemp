using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.StudFunc.Core.Data
{
    internal class ConfigSanitizedResponse : EntityTypeConfiguration<SanitizedSpResponse>
    {
        internal ConfigSanitizedResponse()
        {
            HasRequired(p => p.Result)
                .WithMany(p => p.SanitizedResponses)
                .HasForeignKey(p => p.ResultEntityId);
        }
    }

    internal class ConfigSanitizedComment : EntityTypeConfiguration<SanitizedSpComment>
    {
        internal ConfigSanitizedComment()
        {
            HasRequired(p => p.Result)
                .WithMany(p => p.SanitizedComments)
                .HasForeignKey(p => p.ResultEntityId);
        }
    }

    internal class ConfigStudSpInstrument : EntityTypeConfiguration<SpInstrument>
    {
        public ConfigStudSpInstrument()
        {
            Ignore(p => p.Version);
            Ignore(p => p.FacultyInstructions);
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

    internal class ConfigStudStudent : EntityTypeConfiguration<ProfileStudent>
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
