using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Staff.MeetingTaker;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.User
{
    [TsClass(Module = "ecat.entity.s.user")]
    public class ProfileStaff : ProfileBase
    {
        public ICollection<MeetingAttendee> MeetingAttendances { get; set; }
    }
}
