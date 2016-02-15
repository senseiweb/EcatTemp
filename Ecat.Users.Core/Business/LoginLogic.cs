using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Providers;
using Ecat.Shared.Model;
using LtiLibrary.Core.Lti1;

namespace Ecat.Users.Core.Business
{
    public class LoginLogic
    {
        private readonly IUserRepo _repo;

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

        public async Task<Person> ProcessLtiUser(ILtiRequest request)
        {
            var user = await _repo.GetSecurityUserByEmail(request.LisPersonEmailPrimary);

            if (user == default(Person))
            {
                var roleArray = request.Parameters["ext_institution_roles"]?.Split(',');
                var selectedRole = default(string);

                if (roleArray != null)
                {
                    Array.Sort(roleArray);
                    foreach (var mappedRole in 
                        roleArray.Select(MpTransform.RoleNameToId)
                        .Where(mappedRole => mappedRole != MpInstituteRoleId.Undefined))
                    {
                        selectedRole = mappedRole;
                        break;
                    }
                }

                user = new Person
                {
                    MpInstituteRole = selectedRole,
                    MpAffiliation = MpAffiliation.Unk,
                    MpComponent = MpComponent.Unk,
                    MpPaygrade = MpPaygrade.Unk,
                    MpGender = MpGender.Unk,
                    RegistrationComplete = false
                };
            }

            user.Email = request.LisPersonEmailPrimary;
            user.LastName = request.LisPersonNameFamily;
            user.FirstName = request.LisPersonNameGiven;
            user.BbUserId = request.UserId;
            user.ModifiedDate = DateTime.Now;

            if (await _repo.SaveUserChanges(user) > 0)
            {
                return user;
            }

            throw new DbUpdateException("Save User Changes did not succeed!");
        }
    }
}
