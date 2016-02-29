using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.FacMod.Core
{
    internal class FacConfigStudSpInstrument : EntityTypeConfiguration<SpInstrument>
    {
        public FacConfigStudSpInstrument()
        {
            Ignore(p => p.Version);
            Ignore(p => p.StudentInstructions);
            HasMany(p => p.AssignedGroups)
                .WithOptional(p => p.AssignedSpInstr)
                .HasForeignKey(p => p.AssignedSpInstrId);
        }
    }

    internal class FacConfigStudSpInventory : EntityTypeConfiguration<SpInventory>
    {
        public FacConfigStudSpInventory()
        {
            Ignore(p => p.IsScored);
        }
    }

    internal class FacConfigStudWrkGrp : EntityTypeConfiguration<WorkGroup>
    {
        public FacConfigStudWrkGrp()
        {
            Ignore(p => p.MaxStrat);
            Ignore(p => p.BbGroupId);
        }
    }

    internal class FacConfigStudCrse : EntityTypeConfiguration<Course>
    {
        public FacConfigStudCrse()
        {
            Ignore(p => p.BbCourseId);
        }
    }


    internal class FacConfigProfileBase : EntityTypeConfiguration<ProfileBase>
    {
        public FacConfigProfileBase()
        {
            ToTable("Profile");
           
            HasKey(p => p.PersonId)
                .HasRequired(p => p.Person)
                .WithOptional(p => p.Student);
        }
    }

    internal class FacConfigProfileStudent : EntityTypeConfiguration<ProfileStudent>
    {
        public FacConfigProfileStudent()
        {

            HasKey(p => p.PersonId)
                .HasRequired(p => p.Person)
                .WithOptional(p => p.Student);
        }
    }

    internal class FacConfigProfileFaculty : EntityTypeConfiguration<ProfileFaculty>
    {
        public FacConfigProfileFaculty()
        {
            HasKey(p => p.PersonId)
                .HasRequired(p => p.Person)
                .WithOptional(p => p.Faculty);
        }
    }

    internal class FacConfigPerson : EntityTypeConfiguration<Person>
    {
        public FacConfigPerson()
        {
            Ignore(p => p.BbUserId);
            Ignore(p => p.IsActive);
            Ignore(p => p.ModifiedById);
            Ignore(p => p.MpInstituteRole);
        }
    }
}
