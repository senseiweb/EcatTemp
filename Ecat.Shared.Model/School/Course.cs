using System;
using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    public class Course
    {
        public int Id { get; set; }
        public int AcademyId { get; set; }
        public string BbCourseId { get; set; }
        public string Name { get; set; }
        public string ClassNumber { get; set; }
        public string Term { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime GradDate { get; set; }

        public Academy Academy { get; set; }
        public ICollection<MemberInCourse> CourseMembers { get; set; }
        public ICollection<WorkGroup> Groups { get; set; }
    }
}
