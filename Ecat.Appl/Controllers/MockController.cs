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
        public string GetStudentMockMetadata()
        {
            return _repo.GetMetadata<StudentCtx>();
        }

        [HttpGet]
        public IQueryable GetStudentCourses(int studentId)
        {
            return _ctx.CourseMembers.Where(crseMem => crseMem.PersonId == studentId).Include(c => c.Course);
        }

        [HttpGet]
        public IQueryable GetStudentAssessment(int courseMemberId)
        {
            return
                _ctx.CourseMembers
                    .Include(c => c.Groups)
                    .Include(g => g.Groups.Select(m => m.Group.Members))
                    .Include(c => c.Groups.SelectMany(d => d.AssessorSpResponses))
                    .Include(c => c.Groups.SelectMany(d => d.AuthorOfComments))
                    .Include(c => c.Groups.SelectMany(d => d.AssessorStratResponse))
                    .Where(c => c.Id == courseMemberId);
        }

    }
}
