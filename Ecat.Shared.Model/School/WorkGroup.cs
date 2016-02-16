using System;
using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    public class WorkGroup  {
        public int Id { get; set; }
        public int? AssignedSpInstrId { get; set; }
        public int? AssignedKcInstrId { get; set; }
        public int CourseId { get; set; }
        public string MpCategory { get; set; }
        public string GroupNumber { get; set; }
        public string CustomName { get; set; }
        public string BbGroupId { get; set; }
        public string DefaultName { get; set; }
        public float MaxStrat { get; set; }
        public string MpSpStatus { get; set; }
        public bool IsPrimary { get; set; }

        public Course Course { get; set; }
        public ICollection<FacSpAssessResponse> FacSpReponses { get; set; }
        public ICollection<FacSpStratResponse> FacStratResponses { get; set; }
        public ICollection<FacSpComment> FacSpComments { get; set; }
        public ICollection<MemberInGroup> GroupMembers { get; set; }

        public SpInstrument SpInstrument { get; set; }
        //public KcInstrument KcInstrument { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
   }
}
