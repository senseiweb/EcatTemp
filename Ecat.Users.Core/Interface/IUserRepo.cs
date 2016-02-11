using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Newtonsoft.Json.Linq;

namespace Ecat.Users.Core
{
    public interface IUserRepo
    {
        SaveResult ClientSaveChanges(JObject saveBundle, Person loggedInUser);
        Task<Person> FindUser(int id);
        string GetMetadata { get;  }
    }
}
