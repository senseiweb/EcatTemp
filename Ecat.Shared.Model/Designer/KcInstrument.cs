using System;
using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    public class KcInstrument: IInstrument
    {
        public int Id { get; set; }
        public int? ModifiedById { get; set; }
        public string Instructions { get; set; }
        public string Version { get; set; }
        public bool IsActive { get; set; }

        public DateTime ModifiedDate { get; set; }

        public ICollection<KcResult> Results { get; set; }
        public ICollection<WorkGroup> AssignedGroups { get; set; }


    }
}
