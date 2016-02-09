using System;
using Ecat.Shared.Core;
using Ecat.Shared.Model.MeetingTaker;

namespace Ecat.Shared.Model
{
    public class ActionItem : IAuditable
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public string Todo { get; set; }
        public string Opr { get; set; }
        public string MpActionStatus { get; set; }
        public string Resolution  { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ResolutionDate { get; set; }

        public Meeting Meeting { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}