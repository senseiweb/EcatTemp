using System;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    public class SpStratResponse : IAuditable
    {
        public int Id { get; set; }
        public int AssessorId { get; set; }
        public int AssesseeId { get; set; }
        public int StratPosition { get; set; }
        public int? StratResultId { get; set; }

        public Core.Model.MemberInGroup Assessor { get; set; }
        public Core.Model.MemberInGroup Assessee { get; set; }
        public SpStratResult StratResult { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
