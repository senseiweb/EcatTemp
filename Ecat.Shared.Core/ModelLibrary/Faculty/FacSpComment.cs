using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.School;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Faculty
{
    [TsClass(Module = "ecat.entity.s.faculty")]
    public class FacSpComment: ICompositeEntity
    {
        public string EntityId => $"{StudentPersonId}|{CourseId}|{WorkGroupId}|{Version}";
        public int CourseId { get; set; }
        public int StudentPersonId { get; set; }
        public int FacultyPersonId { get; set; }
        public int WorkGroupId { get; set; }
        public int Version { get; set; }
        public string CommentText { get; set; }
        public string MpCommentFlagRecipient { get; set; }

        public CrseStudentInGroup Student { get; set; }
        public FacultyInCourse Faculty { get; set; }
        public WorkGroup WorkGroup { get; set; }

        [TsIgnore]
        public bool IsDeleted { get; set; }
        [TsIgnore]
        public int? DeletedById { get; set; }
        [TsIgnore]
        public DateTime? DeletedDate { get; set; }
        [TsIgnore]
        public int? ModifiedById { get; set; }
        [TsIgnore]
        public DateTime ModifiedDate { get; set; }
    }
}
