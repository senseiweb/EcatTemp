using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Student.Core.Interface
{
    public interface IStudentAuditable
    {
        Model.RefOnly.Student ModifiedBy { get; set; }
        int ModifiedById { get; set; }
        DateTime ModifiedDate { get; set; }
    }
}
