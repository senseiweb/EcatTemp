using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    [UserGuard]
    public class Student : Profile
    {
        public Person Person { get; set; }

        public string ContactNumber { get; set; }
        public string Commander { get; set; }
        public string Shirt { get; set; }
        public string CommanderEmail { get; set; }
        public string ShirtEmail { get; set; }

        public ICollection<MemberInGroup> GroupPersonas { get; set; }
        public ICollection<MemberInCourse> CoursePersonas { get; set; }
    }
}
