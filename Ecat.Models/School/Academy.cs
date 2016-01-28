using System.Collections.Generic;

namespace Ecat.Models
{
    public class EcAcademy
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MpEducationLevel { get; set; }
        public EpmeSchool EpmeSchool { get; set; }
        public string BbCategoryId { get; set; }
        public ICollection<EcCourse> Courses { get; set; }
    }
}
