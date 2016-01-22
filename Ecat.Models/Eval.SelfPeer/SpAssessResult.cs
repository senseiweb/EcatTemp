namespace Ecat.Models
{
    public class SpAssessResult
    {
        public int Id { get; set; }
        public int GrpMemberId { get; set; }
        public int SpInstrumentId { get; set; }
        public string MpAssessResult { get; set; }
        public float AssessResultScore { get; set; }
        public int ScoreModelVersion { get; set; }
        public int ResponseCount { get; set; }

        public EcGroupMember GrpMember { get; set; }
        public SpInstrument SpInstrument { get; set; }
    }
}
