using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    public class MeetingAttendee
    {
        public int MeetingId { get; set; }
        public int AttendeeId { get; set; }
        public int IsOrganizer { get; set; }

        public HqStaff Attendee { get; set; }
        public Meeting Meeting { get; set; }
    }
}
