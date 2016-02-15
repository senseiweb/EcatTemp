using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json.Linq;

namespace Ecat.Users.Core
{
    public interface IUserLogic
    {
        SaveResult ClientSave(JObject saveBundle);
        Person User { get; set; }
        string GetMetadata { get; }
        Task<object> GetProfile();
        Task<Person> LoginUser(string userName, string password);
        Task<Person> ProcessLtiUser(ILtiRequest parsedRequest);
        Task<bool> UniqueEmailCheck(string email);
    }
}
