using System;
using System.Collections.Generic;

namespace Ecat.Models
{
    public class EcCourse
    {
        public int Id { get; set; }
        public int AcademyId { get; set; }
        public string BbCourseId { get; set; }
        public string Name { get; set; }
        public string ClassNumber { get; set; }
        public string Term { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime GradDate { get; set; }

        public EcAcademy Academy { get; set; }
        public ICollection<EcCourseMember> CourseMembers { get; set; }
        public ICollection<EcGroup> Groups { get; set; }
    }
}
