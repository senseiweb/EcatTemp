using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Model;
using Ecat.Users.Core.Business;
using Newtonsoft.Json.Linq;

namespace Ecat.Users.Core
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
            var userGuard = new GuardUser(loggedInUser);
            _efCtx.BeforeSaveEntitiesDelegate += userGuard.BeforeSaveEntities;
            return _efCtx.SaveChanges(saveBundle);
        }

        public async Task<int> CountEmails(string email)
        {
            return await _userCtx.People.CountAsync(user => user.Email == email);
        }

        public async Task<Person> FindUser(int id)
        {
            return await ((DbSet<Person>) _userCtx.People).FindAsync();
        }

        public async Task<List<Profile>> GetProfiles(int personId)
        {
            return await _userCtx.Profiles.Where(p => p.PersonId == personId).ToListAsync();
        }

        public async Task<Person> GetSecurityUserByEmail(string email)
        {
            return await _userCtx.People
                .Include(s => s.Security)
                .SingleOrDefaultAsync(person => person.Email == email);
        }

        public Task<int> SaveUserChanges(Person person)
        {
            throw new NotImplementedException();
        }
    }
}
