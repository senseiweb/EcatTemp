using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Dal;
using Ecat.Dal.BbWs.BbUser;
using Ecat.Dal.Context;
using Ecat.Models;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;
using Newtonsoft.Json.Linq;

namespace Ecat.Bal
{
    public class UserLogic : IUserLogic
    {
        private readonly ICommonRepo _commonRepo;
        private readonly IUserRepo _userRepo;

        public EcPerson User { get; set; }

        public UserLogic(ICommonRepo commonRepo, IUserRepo userRepo)
        {
            _commonRepo = commonRepo;
            _userRepo = userRepo;
        }

        public async Task<bool> ChangePasswordSuccess(string oldPassword, string newPassword)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ChangePasswordSuccess(string token, string oldPassword, string newPassword)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> CheckUniqueEmail(string email)
        {
            return await _userRepo.GetUser.CountAsync(user => user.Email == email) == 0;
        }

        public async Task<UserVO> GetBbPerson(string bbUserId = null, string bbUserName = null)
        {
            if (bbUserId != null)
            {
                var resultListA =  await _userRepo.LmsGetUserById(UserFilterType.UserByIdWithAvailability, new List<string> { bbUserId });
                return (resultListA.Count > 0) ? resultListA.First() : null;
            }


            var resultListB =
                await _userRepo.LmsGetUserById(UserFilterType.UserByNameWithAvailability, new List<string> {bbUserName});

            return (resultListB.Count > 0) ? resultListB.First() : null;

        }

        public async Task<EcPerson> GetPerson(int pk = 0, string email = null)
        {

            if (pk != 0)
                return await _userRepo.GetUser.Where(person => person.PersonId == pk).SingleOrDefaultAsync();
            return
                await _userRepo.GetUser.Where(person => person.Email == email).SingleOrDefaultAsync() ??
                new EcPerson {Email = email};

        }

        public async Task<object> GetUserProfile()
        {
           return await _userRepo.GetUserProfile(User);
        }

        public LoginToken GetUserSecurityToken(LoginToken token, bool secureIt)
        {
            var identity = new ClaimsIdentity(AuthServerOptions.OAuthBearerOptions.AuthenticationType);

           


            if (!secureIt) return token;

            identity.AddClaim(new Claim(ClaimTypes.Role, ""));
            identity.AddClaim(new Claim(ClaimTypes.PrimarySid, token.Person.PersonId.ToString()));
            var warning = DateTime.Now.Add(TimeSpan.FromMinutes(55));
            var expire = DateTime.Now.Add(TimeSpan.FromMinutes(60));
            var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
            ticket.Properties.IssuedUtc =  DateTime.Now;
            ticket.Properties.ExpiresUtc = expire;

            var userToken = AuthServerOptions.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);
            token.AuthToken = userToken;
            token.TokenExpireWarning = warning;
            token.TokenExpire = expire;

            return token;
        }

        public async Task<LoginToken> LoginUser(string userEmail, string userPassword)
        {
            var user = await _userRepo.GetUserWithSecurity.Where(person => person.Email == userEmail).SingleOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

           var hasValidPassword = PasswordHash.ValidatePassword(userPassword, user.Security.PasswordHash);

            if (!hasValidPassword)
            {
                return null;
            }

            var loginToken = new LoginToken
            {
                PersonId = user.PersonId,
                Person = user,
            };

            return GetUserSecurityToken(loginToken, false);
        }

        public async Task<EcPerson> ResetPin(string bbUserId, string bbUserPass, string newUserPin)
        {
            var user = await _userRepo.GetUser.Where(person => person.BbUserId == bbUserId).FirstOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

            var isValidBbAccount = await _userRepo.LmsCheckCredentials(bbUserId, bbUserPass);

            if (!isValidBbAccount)
            {
                return null;
            }

            user.Security.PasswordHash = PasswordHash.CreateHash(newUserPin);

            return user;

            //return await _commonRepo.SaveUser(user) ? user : null;
        }

        public async Task<bool> SaveChangesSuccess(EcPerson person)
        {
            return await _userRepo.SaveUser(person);
        }

        public SaveResult SaveClientUser(JObject saveBundle)
        {
            return _userRepo.BzSaveUser(saveBundle, User);
        }

        public string DecipherInstituteRole(string[] personRoles)
        {
            if (personRoles.Contains(EcMapInstituteRole.HqAdmin))
            {
                return EcMapInstituteRole.HqAdmin;
            }

            if (personRoles.Contains(EcMapInstituteRole.Designer))
            {
                return EcMapInstituteRole.Designer;
            }

            if (personRoles.Contains(EcMapInstituteRole.CourseAdmin))
            {
                return EcMapInstituteRole.CourseAdmin;
            }

            return personRoles.Contains(EcMapInstituteRole.Facilitator) ? EcMapInstituteRole.Facilitator : EcMapInstituteRole.Student;
        }
    }
}
