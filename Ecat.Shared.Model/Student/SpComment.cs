using System;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    public class SpComment : ISoftDelete, IAuditable
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public int RecipientId { get; set; }
        public int FacFlaggedById { get; set; }
        public string MpCommentType { get; set; }
        public string CommentText { get; set; }
        public string MpCommentFlagFac { get; set; }
        public string MpCommentFlagAuthor { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public MemberInGroup Author { get; set; }
        public MemberInGroup Recipient { get; set; }
        public MemberInCourse FacFlaggedBy { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
