using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    public class Academy
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Base { get; set; }
        public string MpEdLevel { get; set; }
        public string BbCategoryId { get; set; }
        public ICollection<Course> Courses { get; set; }
    }
}
