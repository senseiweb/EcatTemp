using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Ecat.Dal;
using Ecat.Dal.Context;
using System.Data.Entity;
using System.Runtime.InteropServices;
using Ecat.Models;

namespace Ecat.Appl.Controllers
{
    [BreezeController]
    [AllowAnonymous]
    public class MockController : ApiController
    {
        private readonly ICommonRepo _repo;
        private readonly EcatCtx _ctx;

        public MockController(ICommonRepo repo, EcatCtx ctx)
        {
            _repo = repo;
            _ctx = ctx;
        }

        [HttpGet]
        public string Metadata()
        {
            return _repo.GetMetadata<StudentCtx>();
        }

        [HttpGet]
        public IQueryable<EcCourseMember> GetStudentCourses(int studentId)
        {
            return _ctx.CourseMembers.Where(crseMem => crseMem.PersonId == studentId).Include(c => c.Course);
        }

        [HttpGet]
        public IQueryable<EcPerson> GetStudentAssessmen(int courseMemberId)
        {
            return null;
        }

    }
}
