using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json.Linq;

namespace Ecat.UserMod.Core
{
    public class UserLogic : IUserLogic
    {
        private readonly IUserRepo _repo;
        private LoginLogic _loginLogic;

        public Person User { get; set; }

        public string GetMetadata => _repo.GetMetadata;

        public UserLogic(IUserRepo repo)
        {
            _repo = repo;
        }

        public async Task<object> GetProfile()
        {
            return await _repo.GetProfiles(User.PersonId);
        }

        public Task<Person> LoginUser(string userName, string password)
        {
            _loginLogic = _loginLogic ?? new LoginLogic(_repo);
            return _loginLogic.LoginUser(userName, password);
        }

        public async Task<Person> ProcessLtiUser(ILtiRequest parsedRequest)
        {
            _loginLogic = _loginLogic ?? new LoginLogic(_repo);
            return await _loginLogic.ProcessLtiUser(parsedRequest);
        }

        public Task<bool> UniqueEmailCheck(string email)
        {
            _loginLogic = _loginLogic ?? new LoginLogic(_repo);
            return _loginLogic.DuplicateEmail(email);
        }

        public SaveResult ClientSave(JObject saveBundle)
        {
            return _repo.ClientSaveChanges(saveBundle, User);
        }
    }
}
