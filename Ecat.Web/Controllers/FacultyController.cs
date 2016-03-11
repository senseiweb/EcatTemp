using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.ContextProvider;
using Ecat.FacMod.Core;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Web.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.Web.Controllers
{
    [EcatRolesAuthorized(Is = new[] { RoleMap.Faculty })]
    public class FacultyController : EcatBaseBreezeController
    {
        private readonly IFacLogic _facLogic;

        public FacultyController(IFacLogic facLogic)
        {
            _facLogic = facLogic;
        }

        internal override void SetUser(Person person)
        {
            _facLogic.FacultyPerson = person;
        }

        [HttpGet]
        public string Metadata()
        {
            return _facLogic.GetMetadata;
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _facLogic.ClientSave(saveBundle);
        }

        [HttpGet]
        public IQueryable<FacultyInCourse> InitCourses()
        {
            return _facLogic.GetCrsesWithLastestGrpMem();
        }

        [HttpGet]
        public IQueryable<FacultyInCourse> ActiveCourse(int courseId)
        {
            return _facLogic.GetActiveCourseData(courseId);
        }

        [HttpGet]
        public IQueryable<StudSpComment> ActiveWgSpComment()
        {
            return _facLogic.GetStudSpComments();
        }

        [HttpGet]
        public IQueryable<CrseStudentInGroup> WorkGroupAssess(int courseId, int workGroupId, bool addAssessment)
        {
            return _facLogic.GetWorkGroupSpData(courseId, workGroupId, addAssessment);
        }
    }
}
