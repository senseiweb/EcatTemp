using System;

namespace Ecat.Models
{
    public class CogInventory : IInventory<CogInstrument>, IAuditable
    {
        public int Id { get; set; }
        public int? ModifiedById { get; set; }
        public int InstrumentId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsScored { get; set; }
        public bool IsDisplayed { get; set; }  
        public string AdaptiveDescription { get; set; }
        public string InnovativeDescription { get; set; }
        public string ItemDescription { get; set; }
        public bool IsReversed { get; set; }
        public DateTime ModifiedDate { get; set; }

        public CogInstrument Instrument { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}
