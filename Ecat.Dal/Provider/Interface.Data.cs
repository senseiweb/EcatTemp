using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Dal.BbWs.BbUser;
using Ecat.Dal.BbWs.Course;
using Ecat.Dal.BbWs.CourseMember;
using Ecat.Dal.Context;
using Ecat.Models;
using Newtonsoft.Json.Linq;

namespace Ecat.Dal
{
    public interface IBbWrapper
    {
        Task<bool> LoginUser(string userId, string userPassword);
        Task<CourseMembershipWSPortTypeClient> GetCourseMembershipClient();
        Task<CourseWSPortTypeClient> GetCourseClient();
        Task<UserWSPortTypeClient> GetUserClient();

    }

    public interface IBbUserCheckWrapper
    {
        Task<bool> HasValidateCredentials(string bbUid, string bbPass);
    }

   
    public interface ICourseRepo
    {
        Task<List<CourseMembershipVO>> GetCourseMembersById(string bbCourseId, bool forceUpdate = false);
        Task<List<CourseVO>> GetBbCourses(EpmeSchool school = EpmeSchool.Bcee, bool forceUpdate = false);
        Task<List<GroupVO>> GetBbCourseGroup(string bbCourseId, bool forceUpdate = false);
        Task<CategoryVO[]> GetCategoryList();
    }

    public interface ISysAdminRepo
    {
        SaveResult BzSave(JObject saveBundle, EcPerson user);
        IQueryable<EcAcademy> GetAcademies();
    }

    public interface IUserRepo
    {
        Task<object> GetUserProfile(EcPerson user);
        SaveResult BzSaveUser(JObject saveBundle, EcPerson person = null);
        Task<List<UserVO>> LmsGetUserById(UserFilterType filter, List<string> ids);
        Task<bool> LmsCheckCredentials(string bbUiD, string bbPass);
        IQueryable<EcPerson> GetUser { get; }
        IQueryable<EcPerson> GetUserWithSecurity { get; }
        Task<bool> SaveUser(EcPerson person,
          EcStudent studentProfileInfo = null,
          EcFacilitator instructorProfileInfo = null);
    }

    public interface IStudentRepo
    {
        Task<List<EcCourseMember>> GetCourseMems(int personId);
        Task<List<EcGroupMember>> GetAllGroupData(int courseMemId);

        SaveResult BzSave(JObject saveBundle, EcPerson user);
        //Task<bool> SaveAssessment(SpAssessResponse spAssess);
        //Task<bool> SaveStrat(SpStratResponse spStrat);
        //Task<bool> SaveComment(SpComment spComment);
        void PrepareSaveGuards(EcPerson person);
    }

    public interface ICommonRepo
    {
        string GetMetadata<T>() where T : EcatCtx, new();
    }
}
