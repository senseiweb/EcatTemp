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
         
            mb.Ignore(new List<Type>
            {
                typeof (External),
                typeof (Facilitator),
                typeof (Profile),
                typeof (External),
                typeof (Security),
                typeof (HqStaff),
                typeof (FacSpStratResponse),
                typeof (FacSpComment),
                typeof (FacSpAssessResponse)
            });
            //mb.Types().Configure(p => p.Ignore("IsDeleted"));
            //mb.Types().Configure(p => p.Ignore("DeletedById"));
            //mb.Types().Configure(p => p.Ignore("DeletedDate"));

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

            mb.Entity<MemberInGroup>()
                .HasRequired(p => p.Student)
                .WithMany(p => p.GroupPersonas)
                .HasForeignKey(p => p.StudentId);

            mb.Entity<SpAssessResponse>()
                .HasRequired(p => p.Assessee)
                .WithMany(p => p.AssesseeSpResponses)
                .HasForeignKey(p => p.AssesseeId);

            mb.Entity<SpAssessResponse>()
              .HasRequired(p => p.Assessor)
              .WithMany(p => p.AssessorSpResponses)
              .HasForeignKey(p => p.AssessorId);

            mb.Entity<SpStratResponse>()
             .HasRequired(p => p.Assessee)
             .WithMany(p => p.AssesseeStratResponse)
             .HasForeignKey(p => p.AssesseeId);

            mb.Entity<SpStratResponse>()
              .HasRequired(p => p.Assessor)
              .WithMany(p => p.AssessorStratResponse)
              .HasForeignKey(p => p.AssessorId);

            mb.Entity<SpComment>()
                .HasRequired(p => p.Author)
                .WithMany(p => p.AuthorOfComments)
                .HasForeignKey(p => p.AuthorId);

            mb.Entity<SpComment>()
                .HasRequired(p => p.Recipient)
                .WithMany(p => p.RecipientOfComments)
                .HasForeignKey(p => p.RecipientId);

            mb.Entity<WorkGroup>()
                .Ignore(p => p.MaxStrat);

            mb.Entity<Course>()
                .Ignore(p => p.BbCourseId);

            base.OnModelCreating(mb);
        }

        public IDbSet<MemberInGroup> MemberInGroups { get; set; }
        public IDbSet<MemberInCourse> MemberInCourses { get; set; }
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
    }
}
