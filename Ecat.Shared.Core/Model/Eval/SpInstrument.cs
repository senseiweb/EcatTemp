using System;
using System.Collections.Generic;
using Ecat.Designer.Core.Model;

namespace Ecat.Shared.Core.Model.Eval { 

    public class SpInstrument : IInstrument
    {
        public int Id { get; set; }
        public int? ModifiedById { get; set; }
        public string MpEdLevel { get; set; }
        public string GroupType { get; set; }
        public bool IsActive { get; set; }
        public int ScoreModelVersion { get; set; }
        public string Version { get; set; }
        public string SelfInstructions { get; set; }
        public string PeerInstructions { get; set; }
        public string FacilitatorInstructions { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<SpInventory> InventoryCollection { get; set; }
        public ICollection<WorkGroup> AssignedGroups { get; set; }
        public ICollection<string> GroupTypeList => GroupType?.Split('|');
    }
}
