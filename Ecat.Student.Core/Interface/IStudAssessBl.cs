using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Model;
using Ecat.Student.Data.Model;

namespace Ecat.Student.Core.Interface
{
    public interface IStudAssessBl
    {
        Person LoggedInStudent { get; set; }
        Task<IList<SpAssessResponse>> GetStudentSpResponses();
    }
}
