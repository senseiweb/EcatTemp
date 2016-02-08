using System;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Model;
using Ecat.Student.Data.Model.RefOnly;

namespace Ecat.Student.Data.Model
{
    public class SpStratResponse : IAuditable
    {
        public int Id { get; set; }
        public int AssessorId { get; set; }
        public int AssesseeId { get; set; }
        public int StratPosition { get; set; }
        public int? StratResultId { get; set; }

        public MemberInGroup Assessor { get; set; }
        public MemberInGroup Assessee { get; set; }
        public SpStratResult StratResult { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
