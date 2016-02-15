using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json.Linq;

namespace Ecat.Users.Core.Business
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

        public Task<Person> ProcessLtiUser(ILtiRequest parsedRequest)
        {
            throw new NotImplementedException();
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
