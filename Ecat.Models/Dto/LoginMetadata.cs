using System;
using Ecat.Shared.Model;
using Newtonsoft.Json;

namespace Ecat.Models
{
    public class LoginToken
    {
        public int PersonId { get; set;  }
        public string AuthToken { get; set; }
        [JsonIgnore]
        public RoleMap Role { get; set; }
        public DateTime TokenExpireWarning { get; set; }
        public DateTime TokenExpire { get; set; }
        public EcPerson Person { get; set; }
    }
}