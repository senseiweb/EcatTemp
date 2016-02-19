using System;
using System.Collections.Generic;
using System.Data.Entity;
using Ecat.Shared.Core;
using Ecat.Shared.DbManager.Config;
using Ecat.Shared.Model;

namespace FacCore.Data
{
    public class FacCtx : EcatBaseContext<FacCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {

            mb.Configurations.Add(new ConfigSpStratResponse());
            mb.Configurations.Add(new ConfigSpAssessResult());
            mb.Configurations.Add(new ConfigSpComment());
            mb.Configurations.Add(new ConfigSpAssessResponse());
            mb.Configurations.Add(new ConfigMemberInCourse());
            mb.Configurations.Add(new ConfigMemberInGroup());
            mb.Configurations.Add(new ConfigSpStratResult());

            mb.Ignore(new List<Type>
            {
                typeof (External),
                typeof (Facilitator),
                typeof (Profile),
                typeof (External),
                typeof (Security),
                typeof (HqStaff),
            });

            //mb.Types().Configure(p => p.Ignore("IsDeleted"));
            //mb.Types().Configure(p => p.Ignore("DeletedById"));
            //mb.Types().Configure(p => p.Ignore("DeletedDate"));

            mb.Entity<Ecat.Shared.Model.Student>()
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
                .Ignore(p => p.SelfInstructions)
                .Ignore(p => p.PeerInstructions)
                .Ignore(p => p.ModifiedById)
                .Ignore(p => p.ModifiedDate);

            mb.Entity<WorkGroup>()
                .Ignore(p => p.MaxStrat)
                .Ignore(p => p.AssignedKcInstrId)
                .Ignore(p => p.BbGroupId);

            mb.Entity<Course>()
                .Ignore(p => p.BbCourseId);

            base.OnModelCreating(mb);
        }

        public IDbSet<WorkGroup> WorkGroups { get; set; }
        public IDbSet<FacSpAssessResponse> FacSpAssessResponses {get; set;  } 
        public IDbSet<Course> Courses { get; set; }
        public IDbSet<MemberInGroup> MemberInGroups { get; set; }
        public IDbSet<MemberInCourse> MemberInCourses { get; set; }
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
    }
}
