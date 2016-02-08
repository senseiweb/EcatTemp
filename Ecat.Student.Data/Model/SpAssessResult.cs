using Ecat.Shared.Core.Model;
using Ecat.Shared.Core.Model.Eval;
using Ecat.Student.Data.Model.RefOnly;

namespace Ecat.Student.Data.Model
{
    public class SpAssessResult
    {
        public int Id { get; set; }
        public int ResultForId { get; set; }
        public int AssignedInstrumentId { get; set; }
        public string MpSpResult { get; set; }
        public string MpSpResultScore { get; set; }

        public MemberInGroup ResultFor { get; set; }
        public SpInstrument AssignedInstrument { get; set; }
    }
}
    