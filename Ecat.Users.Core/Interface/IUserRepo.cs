using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Users.Core
{
    public interface IUserRepo
    {
        string GetMetadata { get;  }
    }
}
