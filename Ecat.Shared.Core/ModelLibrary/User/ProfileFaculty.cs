using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.School;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.User
{
    [TsClass(Module = "ecat.entity.s.user")]
    public class ProfileFaculty : ProfileBase
    {
        public bool IsCourseAdmin { get; set; }
        public bool IsReportViewer   { get; set; }
        public string AcademyId { get; set; }
        public ICollection<FacultyInCourse> Courses { get; set; }
    }
}
