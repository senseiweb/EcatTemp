using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    public class SpAssessResult
    {
        public int Id { get; set; }
        public int ResultForId { get; set; }
        public int AssignedInstrumentId { get; set; }
        public string MpStudentSpResult { get; set; }
        public float SpResultScore { get; set; }

        public MemberInGroup ResultFor { get; set; }
        public SpInstrument AssignedInstrument { get; set; }
        public ICollection<SantizedResponse> SantizedResponses { get; set; }
        public ICollection<SantizedComment> SantizedComments { get; set; }

    }
}
    