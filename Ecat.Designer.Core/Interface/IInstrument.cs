using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core;

namespace Ecat.Designer.Core.Interface
{
    public interface IInstrument : IAuditable
    {
        int Id { get; set; }
        string Version { get; set; }
        bool IsActive { get; set; }
    }
}
