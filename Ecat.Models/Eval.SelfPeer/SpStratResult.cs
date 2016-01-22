namespace Ecat.Models
{
    public class SpStratResult
    {
        public int Id { get; set; }
        public int GrpMemberId { get; set; }
        public int ScoreModelVersion { get; set; }
        public int StratPosition { get; set; }
        public float StratScore { get; set; }
        public int VoteCount { get; set; }

        public EcGroupMember GrpMember { get; set; }
    }
}
