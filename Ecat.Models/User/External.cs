﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ecat.Models
{
    public class EcExternal: IPersonProfile
    {
        public int PersonId { get; set; }
        public string HomeStation { get; set; }
        public string Bio { get; set; }
        public EcPerson Person { get; set; }
    }
}