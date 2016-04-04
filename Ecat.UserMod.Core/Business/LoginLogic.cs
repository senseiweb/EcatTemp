using System;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Provider;
using Ecat.Shared.Core.Utility;
using LtiLibrary.Core.Lti1;

namespace Ecat.UserMod.Core
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
            var user = await _repo.GetSecurityUserByBbId(request.UserId);

            var userIsCourseAdmin = false;
            
            switch (request.Parameters["Roles"].ToLower())
            {
                case "instructor":
                    userIsCourseAdmin = true;
                    user.MpInstituteRole = MpInstituteRoleId.Faculty;
                    break;
                case "teachingassistant":
                    user.MpInstituteRole = MpInstituteRoleId.Faculty;
                    break;
                case "coursebuilder":
                    user.MpInstituteRole = MpInstituteRoleId.Designer;
                    break;
                default:
                    user.MpInstituteRole = MpInstituteRoleId.Student;
                    break;
            }

            switch (user.MpInstituteRole)
            {
                case MpInstituteRoleId.Faculty:
                    user.Faculty = user.Faculty ?? new ProfileFaculty();
                    user.Faculty.IsCourseAdmin = userIsCourseAdmin;
                    user.Faculty.AcademyId = request.Parameters["custom_ecat_school"];
                    break;
                case MpInstituteRoleId.Designer:
                    user.Designer = user.Designer ?? new ProfileDesigner();
                    user.Designer.AssociatedAcademyId = request.Parameters["custom_ecat_school"];
                    break;
                default:
                    user.Student = user.Student ?? new ProfileStudent();
                    break;
            }

            user.RegistrationComplete = true;
            user.IsActive = true;
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

