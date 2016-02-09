using System;

namespace Ecat.Models
{
    public class FacSpStratResponse: IAuditable
    {
        public int Id { get; set; }
        public int AssesseeId { get; set; }
        public int StratPosition { get; set; }
        public int? StratResultId { get; set; }
        public int AssignedGroupId { get; set; }

        public EcGroupMember Assessee { get; set; }
        public SpStratResult StratResult { get; set; }
        public EcGroup AssignedGroup { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}