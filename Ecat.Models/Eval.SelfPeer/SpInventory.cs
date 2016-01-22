using System;
using System.Collections.Generic;

namespace Ecat.Models
{
    public class SpInventory : IAuditable, IInventory<SpInstrument>
    {
        public int Id { get; set; }
        public int InstrumentId { get; set; }
        public int? ModifiedById { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsScored { get; set; }
        public bool IsDisplayed { get; set; }
        public string SelfBehavior { get; set; }
        public string PeerBehavior { get; set; }
        public string InstructorBehavior { get; set; }
        public DateTime ModifiedDate { get; set; }

        public EcPerson ModifiedBy { get; set; }
        public SpInstrument Instrument { get; set; }
        public ICollection<SpAssessResponse> Responses { get; set; }
    }
}
