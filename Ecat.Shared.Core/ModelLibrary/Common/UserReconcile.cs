using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Core.ModelLibrary.Common
{
    public class UserReconcile
    {
        public int PersonId { get; set; }
        public string BbuserId { get; set; }
        public bool CanDelete { get; set; }

    }
}
