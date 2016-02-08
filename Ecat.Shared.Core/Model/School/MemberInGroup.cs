using System;
using System.Collections.Generic;

namespace Ecat.Shared.Core.Model
{
    public class MemberInGroup
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int CourseEnrollmentId { get; set; }
        public int PersonId { get; set; }

        public WorkGroup Group { get; set; }
        public MemberInCourse CourseEnrollment { get; set; }
        public Person Person { get; set; }

        public ICollection<MemberInGroup> GroupPeers { get; set; }
      
        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
