using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ecat.Models.Headquarter
{
    public class EcDecision: IAuditable
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public string Decision { get; set; }
        public string ApprovalAuthority { get; set; }
        public DateTime ApprovedDate { get; set; }


        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}