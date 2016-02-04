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

        public async Task<List<EcCourseMember>> GetCourseMems(int personId)
        {
            //Get all CourseMember entries for this user where they are a student
            List<EcCourseMember> courses = await _serverCtx.CourseMembers
                .Include(cm => cm.Course)
                //TODO: Fix this MpCourseRole thing... should be able to get it from Enums? Not sure
                //is EcMapInstituteRole what I need? It's not the institute role though
                //Add a systemMappedProperty in the same way as EcSpStatus and EcSpItemResponse?
                .Where(cm => cm.PersonId == personId && cm.MpCourseRole == "Student")//Enum.GetName(typeof(EcRoles), EcRoles.Student))
                .ToListAsync();

            return courses;
        }

        public async Task<List<EcGroupMember>> GetAllGroupData(int courseMemId)
        {
            //Get all GroupMember entires and all the extra stuff for that group...
            //for this user using the given CourseMemberId (unique for a Course and Person combo)
            //unless the GroupMemeber is flagged as deleted
            List<EcGroupMember> groupMems = await _serverCtx.GroupMembers
                .Include(gm => gm.Member)
                .Include(gm => gm.Group)
                .Include(gm => gm.Group.Members)
                .Include(gm => gm.Group.SpInstrument)
                .Include(gm => gm.Group.SpInstrument.Inventories)
                .Include(gm => gm.AssessorSpResponses)
                .Include(gm => gm.AssessorStratResponse)
                .Include(gm => gm.AuthorOfComments)
                .Include(gm => gm.AssessResults)
                .Include(gm => gm.StratResults)
                .Where(gm => gm.Member.Id == courseMemId && !gm.IsDeleted)
                .ToListAsync();

            return groupMems;
        }

        //public async Task<bool> SaveAssessment(SpAssessResponse spAssess)
        //{
            
        //    return await _serverCtx.SaveChangesAsync() > 0;
        //}

        //public async Task<bool> SaveStrat(SpStratResponse spStrat)
        //{
        //    return await _serverCtx.SaveChangesAsync() > 0;
        //}

        //public async Task<bool> SaveComment(SpComment spComment)
        //{
        //    return await _serverCtx.SaveChangesAsync() > 0;
        //}

        public SaveResult BzSave(JObject saveBundle, EcPerson user)
        {
            if (user == null)
            {
                //TODO: ?
                return null;
            }

            PrepareSaveGuards(user);
            return _ctxProvider.SaveChanges(saveBundle);
        }

        public void PrepareSaveGuards(EcPerson person)
        {
            if (_stuSaveguard != null) return;

            _stuSaveguard = new StudentSaveguard(_serverCtx, person);//, this);
            _ctxProvider.BeforeSaveEntitiesDelegate += _stuSaveguard.BeforeSaveEntities;
        }

    }
}