using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Provider;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.Context;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json.Linq;

namespace Ecat.UserMod.Core
{
    public class UserLogic : IUserLogic
    {
        public Person User { get; set; }

        private readonly EFContextProvider<UserCtx> _efCtx;
    

        public UserLogic(EFContextProvider<UserCtx> efCtx)
        {
            _efCtx = efCtx;
        }

        public string Metadata => _efCtx.Metadata();

        public async Task<object> GetProfile() => await _efCtx.Context.Profiles.Where(p => p.PersonId == User.PersonId).ToListAsync();

        public async Task<Person> LoginUser(string userName, string password)
        {
            var user = await _efCtx.Context.People
                .Include(s => s.Security)
                .Include(s => s.Faculty)
                .Include(s => s.Student)
                .SingleOrDefaultAsync(person => person.Email == userName);

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

        public async Task<Person> ProcessLtiUser(ILtiRequest parsedRequest)
        {
            var user = await _efCtx.Context.People
             .Include(s => s.Security)
             .Include(s => s.Faculty)
             .Include(s => s.Student)
             .SingleOrDefaultAsync(person => person.BbUserId == parsedRequest.UserId);

            if (user != null)
            {
                user.ModifiedById = user.PersonId;
            }
            else
            {
                user = new Person
                {
                    IsActive = true,
                    MpGender = MpGender.Unk,
                    MpAffiliation = MpAffiliation.Unk,
                    MpComponent = MpComponent.Unk,
                    MpPaygrade = MpPaygrade.Unk,
                    MpInstituteRole = MpInstituteRoleId.Undefined
                };

                _efCtx.Context.People.Add(user);
            }

            var userIsCourseAdmin = false;

            switch (parsedRequest.Parameters["Roles"].ToLower())
            {
                case "instructor":
                    userIsCourseAdmin = true;
                    user.MpInstituteRole = MpInstituteRoleId.Faculty;
                    break;
                case "teachingassistant":
                    user.MpInstituteRole = MpInstituteRoleId.Faculty;
                    break;
                case "contentdeveloper":
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
                    user.Faculty.AcademyId = parsedRequest.Parameters["custom_ecat_school"];
                    break;
                case MpInstituteRoleId.Designer:
                    user.Designer = user.Designer ?? new ProfileDesigner();
                    user.Designer.AssociatedAcademyId = parsedRequest.Parameters["custom_ecat_school"];
                    break;
                default:
                    user.Student = user.Student ?? new ProfileStudent();
                    break;
            }

            user.RegistrationComplete = true;
            user.IsActive = true;
            user.Email = parsedRequest.LisPersonEmailPrimary;
            user.LastName = parsedRequest.LisPersonNameFamily;
            user.FirstName = parsedRequest.LisPersonNameGiven;
            user.BbUserId = parsedRequest.UserId;
            user.ModifiedDate = DateTime.Now;

            if (await _efCtx.Context.SaveChangesAsync() > 0)
            {
                return user;
            }

            throw new DbUpdateException("Save User Changes did not succeed!");
        }

        public async Task<bool> UniqueEmailCheck(string email) => await _efCtx.Context.People.CountAsync(user => user.Email == email) == 0;

        public SaveResult ClientSave(JObject saveBundle)
        {
            var guardian = new UserGuardian(_efCtx, User);
            _efCtx.BeforeSaveEntitiesDelegate += guardian.BeforeSaveEntities;
            return _efCtx.SaveChanges(saveBundle);
        }
    }
}
