using System;

namespace Ecat.Models
{
     //TODO: Check on save check if recipientId has comment if !isDeleted reject save, isDelete allows save operation 
    public class FacSpComment
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }
        public int AssignedGroupId { get; set; }
        public string CommentText { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public EcGroupMember Recipient { get; set; }
        public EcGroup AssignedGroup { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }
        public EcPerson DeletedBy { get; set; }
        public EcPerson FacFlaggedBy { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}