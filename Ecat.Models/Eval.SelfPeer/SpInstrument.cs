using System;
using System.Collections.Generic;

namespace Ecat.Models
{
    public class SpInstrument: IInstrument
    {
        public int Id { get; set; }
        public int? ModifiedById { get; set; }
        public bool IsActive { get; set; }
        public string Version { get; set; }
        public string SelfInstructions { get; set; }
        public string PeerInstructions { get; set; }
        public string InstructorInstructions { get; set; }
        public DateTime ModifiedDate { get; set; }

        public EcPerson ModifiedBy { get; set; }
        public ICollection<SpInventory> Inventories { get; set; }
        public ICollection<EcGroup> AssignedGroups { get; set; }

    }
}
