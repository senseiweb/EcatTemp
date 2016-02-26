using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.User;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json.Linq;

namespace Ecat.UserMod.Core.Interface
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public interface IUserRepo
    {
        SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> entityGuards);
        Task<int> CountEmails(string email);
        Task<Person> FindUser(int id);
        Task<List<ProfileBase>> GetProfiles(int personId);
        string GetMetadata { get; }
        Task<Person> GetSecurityUserByEmail(string email);
        Task<int> SaveUserChanges(Person person);
    }
}
