using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ecat.Models
{
    public class EcStudent: IPersonProfile
    {
        public int PersonId { get; set; }
        public string ContactNumber { get; set; }
        public string HomeStation { get; set; }
        public string UnitCommander { get; set; }
        [EmailAddress(ErrorMessage = "A properly formed email address is required")]
        public string UnitCommanderEmail { get; set; }
        public string UnitFirstSergeant { get; set; }
        [EmailAddress(ErrorMessage = "A properly formed email address is required")]
        public string UnitFirstSergeantEmail { get; set; }
        public string Bio { get; set; }

        public EcPerson Person { get; set; }
    }
}
