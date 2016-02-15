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
        Task<int> CountEmails(string email);
        Task<Person> FindUser(int id);
        Task<List<Profile>> GetProfiles(int personId);
        string GetMetadata { get;  }
        Task<Person> GetSecurityUserByEmail(string email);
        Task<int> SaveUserChanges(Person person);
    }
}
