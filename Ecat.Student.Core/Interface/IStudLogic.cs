using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Student.Core.Interface
{
    public interface IStudLogic
    {
        Person CurrentStudent { get; set; }
        MemberInCourse CurrentCrsMem { get; set; }
        string GetMetadata { get; }
    }
}
