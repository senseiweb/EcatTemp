using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;

namespace Ecat.Users.Core.Business
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    public class ClientSaveLogic
    {
        private readonly Person _currentUser;

        public ClientSaveLogic(Person loggedInUser)
        {
            _currentUser = loggedInUser;
        }
        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {
            
        }
    }
}
