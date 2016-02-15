using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using Ecat.Shared.Core;
using Ecat.Shared.Model;
using Microsoft.Owin.Security.Provider;

namespace Ecat.Student.Core.Data
{
    public class StudCtx: EcatBaseContext<StudCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            mb.Entity<MemberInGroup>()
                .ToTable("MemberInGroup");

            mb.Ignore(new List<Type>
            {
                typeof (External),
                typeof (Facilitator),
                typeof (External),
                typeof (Security)
            });

            //mb.Types().Configure(p => p.Ignore("IsDeleted"));
            mb.Types().Configure(p => p.Ignore("DeletedById"));
            mb.Types().Configure(p => p.Ignore("DeletedDate"));

            mb.Entity<Shared.Model.Student>()
                .HasKey(p => p.PersonId)
                .HasRequired(p => p.Person)
                .WithOptional(p => p.Student);

            mb.Entity<Person>()
                .Ignore(p => p.BbUserId)
                .Ignore(p => p.IsActive)
                .Ignore(p => p.ModifiedById)
                .Ignore(p => p.MpInstituteRole);

            mb.Entity<SpInventory>()
                .Ignore(p => p.IsScored)
                .Ignore(p => p.ModifiedById)
                .Ignore(p => p.ModifiedDate);

            mb.Entity<SpInstrument>()
               .Ignore(p => p.Version)
               .Ignore(p => p.FacilitatorInstructions)
               .Ignore(p => p.ModifiedById)
               .Ignore(p => p.ModifiedDate);

            mb.Entity<WorkGroup>()
                .Ignore(p => p.MaxStrat);

            mb.Entity<Course>()
                .Ignore(p => p.BbCourseId);



            base.OnModelCreating(mb);
        }

        public IDbSet<MemberInGroup> MemberInGroups { get; set; }
        public IDbSet<MemberInGroup> MemberInCourses { get; set; }
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
    }
}
