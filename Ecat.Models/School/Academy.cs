using System.Collections.Generic;

namespace Ecat.Models
{
    public class EcAcademy
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Base { get; set; }
        public string MpEdLevel { get; set; }
        public string BbCategoryId { get; set; }
        public ICollection<EcCourse> Courses { get; set; }
    }
}
