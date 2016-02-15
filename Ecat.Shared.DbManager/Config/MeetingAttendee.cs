using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
{
    public class ConfigMeetingAttendee : EntityTypeConfiguration<MeetingAttendee>
    {
        public ConfigMeetingAttendee()
        {
            HasKey(p => new {p.AttendeeId, p.MeetingId});
            HasRequired(p => p.Attendee)
                .WithMany(p => p.MeetingAttendences)
                .HasForeignKey(p => p.AttendeeId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Meeting)
                .WithMany(p => p.Attendees)
                .HasForeignKey(p => p.MeetingId)
                .WillCascadeOnDelete(false);
        }
    }
}
