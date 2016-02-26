using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Learner
{
    [TsClass(Module = "ecat.entity.s.learner")]
    public class SanitizedSpComment
    {
        public int Id { get; set; }
        public int ResultEntityId { get; set; }
        public int CourseId { get; set; }
        public int WorkGroupId { get; set; }
        public string AuthorName { get; set; }
        public string CommentText { get; set; }
        public string MpCommentFlagAuthor { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public SpResult Result { get; set; }
    }
}
