using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    public abstract class AssessMap
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public string AcademyId { get; set; }
        public string GroupType { get; set; }
        public DateTime AssignedData { get; set; }
    }
}
