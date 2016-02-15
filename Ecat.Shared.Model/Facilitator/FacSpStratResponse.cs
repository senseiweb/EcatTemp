using System;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    public class FacSpStratResponse: IAuditable
    {
        public int Id { get; set; }
        public int AssesseeId { get; set; }
        public int StratPosition { get; set; }
        public int? StratResultId { get; set; }
        public int AssignedGroupId { get; set; }

        public MemberInGroup Assessee { get; set; }
        public SpStratResult StratResult { get; set; }
        public WorkGroup AssignedGroup { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}