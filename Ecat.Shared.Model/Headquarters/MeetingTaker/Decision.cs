using System;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    public class Decision: IAuditable
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }  
        public string Status { get; set; }
        public string DecisionItem { get; set; }
        public string ApprovalAuthority { get; set; }
        public DateTime ApprovedDate { get; set; }
        public Meeting Meeting { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}