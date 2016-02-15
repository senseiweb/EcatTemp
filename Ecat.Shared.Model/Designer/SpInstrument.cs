using System;
using System.Collections.Generic;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model { 

    public class SpInstrument : IInstrument
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string Version { get; set; }
        public string SelfInstructions { get; set; }
        public string PeerInstructions { get; set; }
        public string FacilitatorInstructions { get; set; }

        public DateTime ModifiedDate { get; set; }
        public int? ModifiedById { get; set; }

        public ICollection<SpInventory> InventoryCollection { get; set; }
        public ICollection<WorkGroup> AssignedGroups { get; set; }
        public ICollection<SpAssessMap> SpAssessMaps { get; set; } 
    }
}
