﻿using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.User;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Ecat.UserMod.Core
{
    public interface IUserLogic
    {
        SaveResult ClientSave(JObject saveBundle);
        Person User { get; set; }
        string Metadata { get; }
        Task<List<object>> GetProfile();
        Task<Person> LoginUser(string userName, string password);
        Task<Person> ProcessLtiUser(ILtiRequest parsedRequest);
        Task<bool> UniqueEmailCheck(string email);
    }
}
