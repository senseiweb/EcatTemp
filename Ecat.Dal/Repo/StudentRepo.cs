using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Dal.BbWs.CourseMember;
using Ecat.Dal.Context;
using Ecat.Models;
using Newtonsoft.Json.Linq;

namespace Ecat.Dal
{
    public class StudentRepo : IStudentRepo
    {
        private readonly EcatCtx _serverCtx;
        private readonly EFContextProvider<EcatCtx> _ctxProvider;
        private StudentSaveguard _stuSaveguard;

        public StudentRepo(EcatCtx serverCtx, EFContextProvider<EcatCtx> efCtxProvider)
        {
            _serverCtx = serverCtx;
            _ctxProvider = efCtxProvider;
        }

        public IQueryable<EcCourseMember> GetCourses => _serverCtx.CourseMembers.Include(cm => cm.Course).AsQueryable();
        //public IQueryable<EcGroupMember> GetGroups => _serverCtx.GroupMembers.Include(gm => gm.Group).AsQueryable();
        //public IQueryable<SpAssessResult> GetSpResults => _serverCtx.SpAssessResults.AsQueryable();
        //public IQueryable<SpAssessResponse> GetSpResponses => _serverCtx.SpAssessResponses.AsQueryable();
        //public IQueryable<SpStratResult> GetStratResults => _serverCtx.StratResults.AsQueryable();
        //public IQueryable<SpStratResponse> GetStratResponses => _serverCtx.StratResponses.AsQueryable();
        //public IQueryable<SpComment> GetComments => _serverCtx.SpComments.AsQueryable();
        //public IQueryable<SpInstrument> GetInstrument => _serverCtx.SpInstruments.Include(i => i.Inventories).AsQueryable();

        public IQueryable<EcGroupMember> GetGroupsAndAssessments => _serverCtx.GroupMembers
            .Include(gm => gm.Group)
            .Include(gm => gm.Group.Members)
            .Include(gm => gm.Group.SpInstrument)
            .Include(gm => gm.Group.SpInstrument.Inventories)
            .Include(gm => gm.Member)
            .Include(gm => gm.AssessorSpResponses)
            .Include(gm => gm.AssessorStratResponse)
            .Include(gm => gm.AuthorOfComments)
            .Include(gm => gm.AssessResults)
            .Include(gm => gm.StratResults)
            .AsQueryable();
        //public IQueryable<SpInstrument> GetInstrument => _serverCtx.SpInstruments
        //    .Include(i => i.Inventories)
        //    .Include(i => i.AssignedGroups)
        //    .AsQueryable();

    }
}