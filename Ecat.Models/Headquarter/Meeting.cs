using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ecat.Models.Headquarter
{
    public class EcMeeting
    {
        public int Id { get; set; }
        public string MeetingReason { get; set; }
        public string Abstract { get; set; }
        public string Backgraound { get; set; }
        public string Purpose { get; set; }

        public DateTime MeetingDate { get; set; }
        public ICollection<EcPerson> Attendees { get; set; }
        public ICollection<EcActionItem> ActionItemses { get; set; }
        public ICollection<EcDecision> Decisions { get; set; }
    }
}