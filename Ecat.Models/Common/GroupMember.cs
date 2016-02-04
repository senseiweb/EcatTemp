using System;
using System.Collections.Generic;

namespace Ecat.Models
{
    public class EcGroupMember : ISoftDelete, IAuditable
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int MemberId { get; set; }
        public EcGroup Group { get; set; }
        public EcCourseMember Member { get; set; }

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
        public EcPerson DeletedBy { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}
