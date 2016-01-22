using System;

namespace Ecat.Models
{
    public class SpStratResponse : ISoftDelete, IAuditable
    {
        public int Id { get; set; }
        public int AssessorId { get; set; }
        public int AssesseeId { get; set; }
        public int StratPosition { get; set; }

        public EcGroupMember Assessor { get; set; }
        public EcGroupMember Assessee { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }
        public EcPerson DeletedBy { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}
