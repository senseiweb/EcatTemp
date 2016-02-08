using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core;
using Ecat.Student.Core.Model.RefOnly;

namespace Ecat.Student.Core.Model
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

        public StudInGroup Author { get; set; }
        public StudInGroup Recipient { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
