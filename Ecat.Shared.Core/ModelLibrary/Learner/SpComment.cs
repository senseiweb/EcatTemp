using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.School;
using Newtonsoft.Json;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Learner
{
    [TsClass(Module = "ecat.entity.s.learner")]
    public class SpComment : ICompositeEntity
    {
        public string EntityId => $"{AuthorPersonId}|{RecipientPersonId}|{CourseId}|{WorkGroupId}";
        public int AuthorPersonId { get; set; }
        public int RecipientPersonId { get; set; }
        public int? FacultyPersonId { get; set; }
        public int WorkGroupId { get; set; }
        public int CourseId { get; set; }

        [JsonIgnore][TsIgnore]
        public int CommentVersion { get; set; }

        public string MpCommentType { get; set; }
        public string CommentText { get; set; }
        public string MpCommentFlagFac { get; set; }
        public string MpCommentFlagAuthor { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public CrseStudentInGroup Author { get; set; }
        public CrseStudentInGroup Recipient { get; set; }
        public FacultyInCourse CommentFlaggedBy { get; set; }
        public WorkGroup WorkGroup { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
