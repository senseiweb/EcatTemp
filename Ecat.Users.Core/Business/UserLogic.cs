using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Newtonsoft.Json.Linq;

namespace Ecat.Users.Core.Business
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    public class UserLogic : IUserLogic
    {
        private readonly IUserRepo _repo;

        public Person CurrentUser { get; set; }

        public string GetMetadata => _repo.GetMetadata;

        public UserLogic(IUserRepo repo)
        {
            _repo = repo;
        }

        public SaveResult ClientSave(JObject saveBundle)
        {
            return _repo.ClientSaveChanges(saveBundle);
        }


    }
}
