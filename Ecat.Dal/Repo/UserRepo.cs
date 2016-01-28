using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Dal.BbWs.BbUser;
using Ecat.Dal.Context;
using Ecat.Models;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;
using Newtonsoft.Json.Linq;
using EntityState = System.Data.Entity.EntityState;

namespace Ecat.Dal
{
    public class UserRepo : IUserRepo
    {
        private readonly EcatCtx _serverCtx;
        private readonly EFContextProvider<EcatCtx> _ctxProvider;
        private UserSaveguard _userSaveguard;
        private readonly IBbWrapper _ws;
        private readonly IBbUserCheckWrapper _wsUser;

        public UserRepo(EcatCtx serverCtx, IBbWrapper ws, IBbUserCheckWrapper wsUser, EFContextProvider<EcatCtx> efCtxProvider)
        {
            _serverCtx = serverCtx;
            _wsUser = wsUser;
            _ws = ws;
            _ctxProvider = efCtxProvider;
        }

        public async Task<List<UserVO>> LmsGetUserById(UserFilterType filter, List<string> ids)
        {

            var userFilter = new UserFilter
            {
                filterTypeSpecified = true,
                filterType = (int)filter,
                available = true,
                availableSpecified = true
            };

            switch (filter)
            {
                case UserFilterType.UserByCourseIdWithAvailability:
                    userFilter.courseId = ids.ToArray();
                    break;
                case UserFilterType.UseByGroupIdWithAvailability:
                    userFilter.groupId = ids.ToArray();
                    break;
                case UserFilterType.AllUsersWithAvailability:
                    break;
                case UserFilterType.UserByIdWithAvailability:
                    userFilter.id = ids.ToArray();
                    break;
                case UserFilterType.UserByBatchIdWithAvailability:
                    break;
                case UserFilterType.UserByNameWithAvailability:
                    userFilter.name = ids.ToArray();
                    break;
                case UserFilterType.UserBySystemRole:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(filter), filter, null);
            }

            var client = await _ws.GetUserClient();
            var result = await client.getUserAsync(userFilter);
            return result.@return?.ToList();
        }

        public async Task<bool> LmsCheckCredentials(string bbUiD, string bbPass)
        {
            return await _wsUser.HasValidateCredentials(bbUiD, bbPass);
        }

        public IQueryable<EcPerson> GetUser => _serverCtx.Persons.AsQueryable();

        public IQueryable<EcPerson> GetUserWithSecurity => _serverCtx.Persons.Include(u => u.Security).AsQueryable();

        public async Task<object> GetUserProfile(EcPerson user)
        {
            switch (user.MpInstituteRole)
            {
                case EcMapInstituteRole.Student:
                    return await _serverCtx.Students.FindAsync(user.PersonId);
                case EcMapInstituteRole.Facilitator:
                    return await _serverCtx.Facilitators.FindAsync(user.PersonId);
                default:
                    return await _serverCtx.Externals.FindAsync(user.PersonId);
            }
        }

        public async Task<EcSecurity> GetSecurity(EcPerson person)
        {
            var securityInfo = await _serverCtx.Securities.FindAsync(person.PersonId);
            return securityInfo ?? new EcSecurity() { PersonId = person.PersonId };
        }

        public async Task<bool> SaveUser(EcPerson person, EcStudent studentProfileInfo = null, EcFacilitator instructorProfileInfo = null)
        {

            if (person.PersonId != 0)
            {
                return await _serverCtx.SaveChangesAsync() > 0;
            }

            _serverCtx.Persons.Add(person);

            if (studentProfileInfo != null)
            {
                _serverCtx.Students.Add(studentProfileInfo);
            }

            if (instructorProfileInfo != null)
            {
                _serverCtx.Facilitators.Add(instructorProfileInfo);
            }

            return  await _serverCtx.SaveChangesAsync() > 0;
        }

        public SaveResult BzSaveUser(JObject saveBundle, EcPerson person = null)
        {
            person = person ?? new EcPerson();
            PrepareSaveGuards(person);
            return _ctxProvider.SaveChanges(saveBundle);
        }

        private void PrepareSaveGuards(EcPerson person)
        {
            if (_userSaveguard != null) return;

            _userSaveguard = new UserSaveguard(_serverCtx, person);
            _ctxProvider.BeforeSaveEntitiesDelegate += _userSaveguard.BeforeSaveEntities;
        }
    }
}
