using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Newtonsoft.Json.Linq;

namespace Ecat.Student.Core.Interface
{
    public interface IStudLogic
    {
        Person CurrentStudent { get; set; }
        MemberInCourse CurrentCrsMem { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        string GetMetadata { get; }
    }
}
