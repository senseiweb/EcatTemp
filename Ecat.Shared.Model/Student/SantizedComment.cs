using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    public class SantizedComment
    {
        public int Id { get; set; }
        public int ResultId { get; set; }
        public string AuthorName { get; set; }
        public string CommentText { get; set; }
        public string MpCommentFlagAuthor { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public SpAssessResult Result { get; set; }

    }
}
