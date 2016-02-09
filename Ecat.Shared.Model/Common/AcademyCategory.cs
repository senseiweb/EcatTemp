using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ecat.Models
{
    public class AcademyCategory
    {
        public string Id { get; set; }
        public string BbCatId { get; set; }
        public string BbCatName { get; set; }
        public int RelatedCoursesCount { get; set; }
    }
}