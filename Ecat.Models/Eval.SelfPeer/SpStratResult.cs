using System.Collections.Generic;

namespace Ecat.Models
{
    public class SpStratResult
    {
        public int Id { get; set; }
        public int GrpMemberId { get; set; }
        public int Fac { get; set; }
        public int ScoreModelVersion { get; set; }
        public int OriginalStratPosition { get; set; }
        public int FinalStratPosition { get; set; }
        public float StratScore { get; set; }

        public EcGroupMember GrpMember { get; set; }
        public FacSpStratResponse FacStratResponse { get; set; }
        public ICollection<SpStratResponse> SourceResponses { get; set; } 
    }
}
