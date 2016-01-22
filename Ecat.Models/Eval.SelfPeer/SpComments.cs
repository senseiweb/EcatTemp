using System;

namespace Ecat.Models
{
    public class SpComment : ISoftDelete, IAuditable
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public int RecipientId { get; set; }
        public string MpCommentType { get; set; }
        public string CommentText { get; set; }
        public string MpInstructorFlag { get; set; }
        public string MpRecipientFlag { get; set; }

        public EcGroupMember Author { get; set; }
        public EcGroupMember Recipient { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }
        public EcPerson DeletedBy { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}
