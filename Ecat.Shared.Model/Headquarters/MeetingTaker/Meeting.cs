using System;
using System.Collections.Generic;
using Ecat.Shared.Model.MeetingTaker;

namespace Ecat.Shared.Model
{
    public class Meeting
    {
        public int Id { get; set; }
        public string MeetingReason { get; set; }
        public string Abstract { get; set; }
        public string Background { get; set; }
        public string Purpose { get; set; }

        public DateTime MeetingDate { get; set; }
        public ICollection<Person> Attendees { get; set; }
        public ICollection<ActionItem> ActionItemses { get; set; }
        public ICollection<Decision> Decisions { get; set; }
    }
}