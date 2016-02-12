using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Providers;
using Ecat.Shared.Model;

namespace Ecat.Users.Core.Business
{
    public class LoginLogic
    {
        public IUserRepo _repo { get; set; }

        public LoginLogic(IUserRepo repo)
        {
            _repo = repo;
        }

        public async Task<bool> DuplicateEmail(string emailToCheck)
        {
            return await _repo.CountEmails(emailToCheck) == 0;
        }

        public async Task<Person> LoginUser(string email, string password)
        {
            var user = await _repo.GetSecurityUserByEmail(email);

            if (user == default(Person))
            {
                throw new UnauthorizedAccessException("Invalid Username/Password Combination");
            }

            var isValid = PasswordHash.ValidatePassword(password, user.Security.PasswordHash);

            if (!isValid)
            {
                throw new UnauthorizedAccessException("Invalid Username/Password Combination");
            }

            return user;
        }

        public async 
    }
}
