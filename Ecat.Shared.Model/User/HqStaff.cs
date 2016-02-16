using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    public class HqStaff : Profile
    {
        public Person Person { get; set; }

        public ICollection<MeetingAttendee> MeetingAttendences { get; set; }
    }
}
