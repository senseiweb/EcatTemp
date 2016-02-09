using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Data.Model;
using Person = Ecat.Shared.Core.Model.Person;

namespace Ecat.Student.Core.Interface
{
    public interface IStudAssessBl
    {
        Person LoggedInStudent { get; set; }
        Task<IList<SpAssessResponse>> GetStudentSpResponses();
    }
}
