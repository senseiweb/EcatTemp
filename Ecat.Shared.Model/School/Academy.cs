using System.Collections.Generic;

namespace Ecat.Shared.Model
{
    public class Academy
    {
        public string Id { get; set; }
        public string LongName { get; set; }
        public string ShortName { get; set; }
        public EdLevel EdLevel { get; set; }
        public AcademyBase Base { get; set; }
        public string BbCategoryId { get; set; }
        public string ParentBbCategoryId { get; set; }
    }
}
