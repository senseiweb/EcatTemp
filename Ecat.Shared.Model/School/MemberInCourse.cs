using System;
using System.Collections.Generic;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    public class MemberInCourse : ISoftDelete
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public int PersonId { get; set; }
        public string MpCourseRole { get; set; }

        public Course Course { get; set; }
        public Person Person { get; set; }
        public ICollection<MemberInGroup> StudGroupEnrollments { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Person DeletedBy { get; set; }
    }
}
