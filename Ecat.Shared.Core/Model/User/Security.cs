using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Core.Model
{
    public class Security
    {
        public int PersonId { get; set; }
        public string PasswordHash { get; set; }

        public Person Person { get; set; }
    }
}
    