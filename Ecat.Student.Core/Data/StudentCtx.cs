using System.Data.Entity;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Config;
using Ecat.Shared.Model;
using Microsoft.Owin.Security.Provider;

namespace Ecat.Student.Core.Data
{
    public class StudContext: EcatBaseContext<StudContext>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            mb.Entity<MemberInGroup>()
                .ToTable(MpTableNames.Person);

            mb.Entity<SpInventory>()
                .Ignore(p => p.IsScored)
                .Ignore(p => p.ModifiedById)
                .Ignore(p => p.ModifiedDate);

            mb.Entity<SpInstrument>()
               .Ignore(p => p.MpEdLevel)
               .Ignore(p => p.ScoreModelVersion)
               .Ignore(p => p.Version)
               .Ignore(p => p.FacilitatorInstructions)
               .Ignore(p => p.ModifiedById)
               .Ignore(p => p.ModifiedDate);

            mb.Entity<WorkGroup>()
                .Ignore(p => p.MaxStrat);

            mb.Entity<Course>()
                .Ignore(p => p.BbCourseId)
                .Ignore(p => p.Academy);

            mb.Ignore<MemberInCourse>();
            mb.Configurations.Add(new ConfigPerson());

            base.OnModelCreating(mb);
        }

        public IDbSet<MemberInGroup> MemberInGroups { get; set; }
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
    }
}
