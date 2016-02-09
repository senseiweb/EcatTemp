using System;

namespace Ecat.Models
{
    public class CogInstrument: IInstrument
    {
        public int Id { get; set; }
        public int? ModifiedById { get; set; }
        public string Version { get; set; }
        public bool IsActive { get; set; }

        public string CogInstructions { get; set; }
        public string MpCogInstrumentType { get; set; }
        public string CogResultRange { get; set; }
        public EcPerson ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
