using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;

namespace Ecat.Models.Headquarter
{
    public class EcActionItem : IAuditable
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public string Todo { get; set; }
        public string Opr { get; set; }
        public string MpActionStatus { get; set; }
        public string Resolution  { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ResolutionDate { get; set; }

        public EcMeeting Meeting { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}