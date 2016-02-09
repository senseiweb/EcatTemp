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

        [HttpGet]
        public IQueryable<EcCourseMember> GetFacilitatorCourses(int facId)
        {
            return _ctx.CourseMembers.Where(cm => cm.PersonId == facId).Include(cm => cm.Course);
        }

        [HttpGet]
        public IQueryable<EcGroup> GetFacilitatorGroups(int courseMemId)
        {
            return _ctx.Groups.Where(g => g.CourseId == courseMemId);
        }

        [HttpGet]
        public IQueryable<EcGroupMember> GetFacilitatorGroupDetails(int groupId)
        {
            return _ctx.GroupMembers.Where(gm => gm.GroupId == groupId)
                .Include(gm => gm.AssessorSpResponses)
                .Include(gm => gm.AssessorStratResponse)
                .Include(gm => gm.AuthorOfComments);
        }

    }
}
