using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Ecat.Models
{
    public class EcSecurity: IPersonProfile
    {
        public int PersonId { get; set; }

        [JsonIgnore]
        public string PasswordHash { get; set; }
        public string TempPassword { get; set;  }
        public DateTime? PasswordExpire { get; set; } 
        public EcPerson Person { get; set; }
    }
}