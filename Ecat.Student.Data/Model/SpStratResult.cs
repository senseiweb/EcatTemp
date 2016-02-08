using System;
using System.Collections.Generic;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Model;

namespace Ecat.Student.Data.Model
{
    public class SpStratResult : IAuditable
    {
        public int Id { get; set; }
        public int GrpMemberId { get; set; }
        public int FacStratResponseId  { get; set; }
        public int OriginalStratPosition { get; set; }
        public int FinalStratPosition { get; set; }
        public float StratScore { get; set; }

        public Person GrpMember { get; set; }
        public ICollection<SpStratResponse> SourceResponses { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
