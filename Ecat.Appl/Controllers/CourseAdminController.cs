//using System;
//using System.Security.Claims;
//using System.Threading.Tasks;
//using System.Web.Http;
//using System.Web.Http.Controllers;
//using Breeze.ContextProvider;
//using Breeze.WebApi2;
//using Ecat.Dal;
//using Ecat.Dal.Context;
//using Ecat.Models;
//using Newtonsoft.Json.Linq;
//using System.Net.Http.Formatting;
//using Ecat.Bal;
//using Ecat.Appl.Utilities;

//namespace Ecat.Appl.Controllers
//{
//    [BreezeController]
//    [EcatRolesAuthorized(Is = new[] { EcRoles.Student, EcRoles.External })]
//    public class CourseAdminController : EcatApiController
//    {
//        private readonly ICommonRepo _commonRepo;
//        private readonly ICourseAdminLogic _courseAdminLogic;

//        public CourseAdminController(ICommonRepo common, ICourseAdminLogic courseAdminLogic)
//        {
//            _commonRepo = common;
//            _courseAdminLogic = courseAdminLogic;
//        }

//        internal override void SetUser(EcPerson person)
//        {
//            _courseAdminLogic.User = person;
//        }

//        //protected override void Initialize(HttpControllerContext controllerContext)
//        //{
//        //    base.Initialize(controllerContext);
//        //}

//        [HttpGet]
//        public string Metadata()
//        {
//            return _commonRepo.GetMetadata<EcatCtx>();
//        }

//        [HttpGet]
//        public async Task<object> GetCourses()
//        {
//            return await _courseAdminLogic.GetCourses();
//        }

//        [HttpGet]
//        public async Task<object> GetAllGroupData()
//        {
//            var selectedCourse = Request.Headers.GetValues("X-ECAT-PVT-AUTH").ToString();
//            int selCourseId;
//            int.TryParse(selectedCourse, out selCourseId);
//            return await _courseAdminLogic.GetGroupData(selCourseId);
//        }

//        [HttpPost]
//        public SaveResult SaveChanges(JObject saveBundle)
//        {
//            return _courseAdminLogic.BzSave(saveBundle);
//        }
//    }
//}