using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    [UserGuard]
    public class Facilitator: Profile
    {
        public bool IsCourseAdmin { get; set; }
        public virtual Person Person { get; set; }
        public ICollection<MemberInCourse> CoursePersonas { get; set; }
    }
}
