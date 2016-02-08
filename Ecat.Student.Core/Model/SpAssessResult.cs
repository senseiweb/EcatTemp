using Ecat.Designer.Core.Model;
using Ecat.Student.Core.Model.RefOnly;

namespace Ecat.Student.Core.Model
{
    public class SpAssessResult
    {
        public int Id { get; set; }
        public int ResultForId { get; set; }
        public int AssignedInstrumentId { get; set; }
        public string MpSpResult { get; set; }
        public string MpSpResultScore { get; set; }

        public StudInGroup ResultFor { get; set; }
        public SpInstrument AssignedInstrument { get; set; }
    }
}
    