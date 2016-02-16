﻿using System;
using Newtonsoft.Json;

namespace Ecat.Shared.Model
{
    public class LoginToken
    {
        public int PersonId { get; set;  }
        [JsonIgnore]
        public RoleMap Role { get; set; }
        public string AuthToken { get; set; }
        public DateTime TokenExpireWarning { get; set; }
        public DateTime TokenExpire { get; set; }
        public Person Person { get; set; }
    }
}