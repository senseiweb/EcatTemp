using System;
using System.Collections.Generic;

namespace Ecat.Shared.Model
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
        public ICollection<SpAssessResponse> AssessorSpResponses { get; set; }
        public ICollection<SpAssessResponse> AssesseeSpResponses { get; set; }
        public ICollection<SpComment> AuthorOfComments { get; set; }
        public ICollection<SpComment> RecipientOfComments { get; set; }
        public ICollection<SpStratResponse> AssessorStratResponse { get; set; }
        public ICollection<SpStratResponse> AssesseeStratResponse { get; set; }

        public ICollection<SpAssessResult> AssessResults { get; set; }
        public ICollection<SpStratResult> StratResults { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
