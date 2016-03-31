using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.UserMod.Core
{
    public class UserRepo : IUserRepo
    {
        private readonly UserCtx _userCtx;
        private readonly EFContextProvider<UserCtx> _efCtx;

        public string GetMetadata => _efCtx.Metadata();

        public UserRepo(UserCtx userCtx, EFContextProvider<UserCtx> efCtx)
        {
            _userCtx = userCtx;
            _efCtx = efCtx;
        }

        public SaveResult ClientSaveChanges(JObject saveBundle, Person loggedInUser)
        {
            var guardian = new UserGuardian(_efCtx, loggedInUser);
            _efCtx.BeforeSaveEntitiesDelegate += guardian.BeforeSaveEntities;
            return _efCtx.SaveChanges(saveBundle);
        }

        public async Task<int> CountEmails(string email)
        {
            return await _userCtx.People.CountAsync(user => user.Email == email);
        }

        public async Task<Person> FindUser(int id)
        {
            return await ((DbSet<Person>)_userCtx.People).FindAsync();
        }

        public async Task<List<ProfileBase>> GetProfiles(int personId)
        {
            return await _userCtx.Profiles.Where(p => p.PersonId == personId).ToListAsync();
        }

        public async Task<Person> GetSecurityUserByEmail(string email)
        {
            return await _userCtx.People
                .Include(s => s.Security)
                .Include(s => s.Faculty)
                .Include(s => s.Student)
                .SingleOrDefaultAsync(person => person.Email == email);
        }

        public async Task<Person> GetSecurityUserByBbId(string bbUserId)
        {
            var user =  await _userCtx.People
                .Include(s => s.Security)
                .Include(s => s.Faculty)
                .Include(s => s.Student)
                .SingleOrDefaultAsync(person => person.BbUserId == bbUserId);

            if (user != null)
            {
                user.ModifiedById = user.PersonId;
                return user;
            }

            user = new Person
            {
                IsActive = true,
                MpGender = MpGender.Unk,
                MpAffiliation = MpAffiliation.Unk,
                MpComponent = MpComponent.Unk,
                MpPaygrade = MpPaygrade.Unk,
                MpInstituteRole = MpInstituteRoleId.Undefined
            };
            _userCtx.People.Add(user);
            return user;

        }

        public async Task<int> SaveUserChanges(Person person)
        {
            return await _userCtx.SaveChangesAsync();
        }
    }
}

