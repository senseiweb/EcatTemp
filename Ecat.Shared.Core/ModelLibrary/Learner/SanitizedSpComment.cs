﻿using System;
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
        public int AuthorId { get; set; }
        public int RecipientId { get; set; }
        public int CourseId { get; set; }
        public int WorkGroupId { get; set; }
        public string AuthorName { get; set; }
        public string CommentText { get; set; }
        public StudSpCommentFlag Flag { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public SpResult Result { get; set; }
    }
}
