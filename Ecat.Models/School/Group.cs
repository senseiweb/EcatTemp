using System.Collections;
using System.Collections.Generic;

namespace Ecat.Models
{
    public class EcGroup
    {
        public int Id { get; set; }
        public int? SpInstrumentId { get; set; }
        public int? KcInstrumentId { get; set; }
        public int CourseId { get; set; }
        public string MpCategory { get; set; }
        public string GroupNumber { get; set; }
        public string CustomName { get; set; }
        public string BbGroupId { get; set; }
        public string DefaultName { get; set; }
        public float MaxStrat { get; set; }
        public int MpSpStatus { get; set; }
        public bool IsHomeGroup { get; set; }

        public EcCourse Course { get; set; }
        public ICollection<EcGroupMember> Members { get; set; }
        public SpInstrument SpInstrument { get; set; }
        public KcInstrument KcInstrument { get; set; }
    }
}
