using System;

namespace Ecat.Shared.Model
{
     //TODO: Check on save check if recipientId has comment if !isDeleted reject save, isDelete allows save operation 
    public class FacSpComment
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }
        public int AssignedGroupId { get; set; }
        public string CommentText { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public MemberInGroup Recipient { get; set; }
        public WorkGroup AssignedGroup { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}