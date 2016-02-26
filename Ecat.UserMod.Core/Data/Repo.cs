using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.UserMod.Core.Business;
using Ecat.UserMod.Core.Interface;
using Newtonsoft.Json.Linq;

namespace Ecat.UserMod.Core.Data
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

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

        public SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards)
        {
            if (!saveGuards.Any()) return _efCtx.SaveChanges(saveBundle);

            foreach (var saveGuard in saveGuards)
            {
                _efCtx.BeforeSaveEntitiesDelegate += saveGuard;
            }

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
                .SingleOrDefaultAsync(person => person.Email == email);
        }

        public Task<int> SaveUserChanges(Person person)
        {
            throw new NotImplementedException();
        }
    }
}

