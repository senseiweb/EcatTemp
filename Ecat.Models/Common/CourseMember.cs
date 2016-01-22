using System;
using System.Collections.Generic;

namespace Ecat.Models
{
    public class EcCourseMember : ISoftDelete
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public int PersonId { get; set; }
        public string MpCourseRole { get; set; }

        public EcCourse Course { get; set; }
        public EcPerson Person { get; set; }
        public ICollection<EcGroupMember> Groups { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }
        public EcPerson DeletedBy { get; set; }
    }
}
