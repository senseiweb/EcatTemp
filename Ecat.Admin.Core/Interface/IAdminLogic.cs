using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Newtonsoft.Json.Linq;

namespace Ecat.Admin.Core.Interface
{
    public interface IAdminLogic
    {
        Person Admin { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        List<Academy> GetAcademies(); 
        string GetMetadata { get; }
    }
}
