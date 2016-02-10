using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Users.Core
{
    public interface IUserLogic
    {
        string GetMetadata { get; }
        Person CurrentUser { get; set; }
    }
}
