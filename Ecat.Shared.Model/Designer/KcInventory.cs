using System;
using System.Collections.Generic;

namespace Ecat.Models
{
    public class KcInventory : IInventory<KcInstrument>, IAuditable
    {
        public int Id { get; set; }
        public int? ModifiedById { get; set; }
        public int InstrumentId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsScored { get; set; }
        public bool IsDisplayed { get; set; }
        public string KnowledgeArea { get; set; }
        public string QuestionText { get; set; }
        public float ItemWeight { get; set; }
        public string Answer { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }

        public KcInstrument Instrument { get; set; }
        public ICollection<KcResponse> Responses { get; set; }
    }
}
