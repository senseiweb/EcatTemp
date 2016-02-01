using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Dal.BbWs.BbUser;
using Ecat.Dal.BbWs.Course;
using Ecat.Models;
using Newtonsoft.Json.Linq;

namespace Ecat.Dal
{
    public interface IUserLogic
    {
        Task<bool> CheckUniqueEmail(string email);
        Task<bool> ChangePasswordSuccess(string oldPassword, string newPassword);
        Task<bool> ChangePasswordSuccess(string token, string oldPassword, string newPassword);
        Task<EcPerson> GetPerson(int pk = 0,  string email = null);
        Task<UserVO> GetBbPerson(string bbUserId = null, string bbUserName = null);
        Task<object> GetUserProfile();
        Task<LoginToken> LoginUser(string userEmail, string userPassword);
        Task<EcPerson> ResetPin(string bbUserId, string bbUserPass, string newUserPin);
        SaveResult SaveClientUser(JObject saveBundle);
        LoginToken GetUserSecurityToken(LoginToken token, bool secureIt);
        Task<bool> SaveChangesSuccess(EcPerson person);
        EcPerson User { get; set; }
        string DecipherInstituteRole(string[] personRoles);
    }


    public interface ISysAdminLogic
    {
        EcPerson User { get; set; }
        Task<List<AcademyCategory>> GetAcademyCategory();
        IQueryable<EcAcademy> GetAcademies();
        SaveResult BzSave(JObject saveBundle);
    }

    public interface ICommonLogic
    {
        Task<CategoryVO[]> GetCategoryList();

    }

}
