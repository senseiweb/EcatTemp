using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Core.Model
{
    public abstract class Profile
    {
        public int PersonId { get; set; }
        public string Bio { get; set; }

    }
}
