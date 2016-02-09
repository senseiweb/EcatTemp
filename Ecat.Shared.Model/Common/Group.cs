using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ecat.Models.External
{
    public class EcExternalGroup
    {
        public int Id { get; set; }
        public int FacilitatorId { get; set; }
        public string Base { get; set; }
        public string Unit { get; set; }

        public EcPerson Facilitator { get; set; }
    }
}