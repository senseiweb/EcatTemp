using System.Data.Entity;
using Ecat.Designer.Core.Model;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Model;
using Ecat.Shared.Core.Model.Eval;
using Ecat.Shared.Data;
using Ecat.Student.Data.Interface;
using Ecat.Student.Data.Model;
using Ecat.Student.Data.Model.RefOnly;

namespace Ecat.Student.Data.Context
{
    public class StudContext: BaseContext<StudContext>, IStudOpsContext
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            mb.Entity<StudInGroup>()
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

            base.OnModelCreating(mb);
        }

        public IDbSet<StudInGroup> StudInGroups { get; set; }
        public IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        public IDbSet<SpAssessResult> SpAssessResults { get; set; }
        public IDbSet<SpComment> SpComments { get; set; }
        public IDbSet<SpStratResponse> SpStratResponses { get; set; }
        public IDbSet<SpStratResult> SpStratResults { get; set; }
    }
}
