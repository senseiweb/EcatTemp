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
    public class StudentLogic : IStudentLogic
    {
        private readonly ICommonRepo _commonRepo;
        private readonly IStudentRepo _studentRepo;

        public EcPerson User { get; set; }

        public StudentLogic(ICommonRepo commonRepo, IStudentRepo studentRepo)
        {
            _commonRepo = commonRepo;
            _studentRepo = studentRepo;
        }

        public async Task<List<EcCourseMember>> GetCourses()
        {
            return await _studentRepo.GetCourseMems(User.PersonId);
        }

        public async Task<List<EcGroupMember>> GetAllGroupData(EcCourseMember courseMem)
        {
            //Double check the given CourseMember is this user as a student
            if (courseMem.PersonId != User.PersonId || courseMem.MpCourseRole != EcRoles.Student.ToString())
            {
                return null;
            }

            List<EcGroupMember> groupMems = await _studentRepo.GetAllGroupData(courseMem.Id);

            //groupMems = groupMems.SelectMany(gm => gm.Group.Members).Where(member => !member.IsDeleted).ToList();

            //groupMems.ForEach(gm =>
            //{
            //    gm.Group.Members.Select(member => !member.IsDeleted);
            //    gm.AssessorSpResponses = gm.AssessorSpResponses.Where(spresp => !spresp.IsDeleted).ToList();
            //    gm.AssessResults = gm.AssessResults.Where(spresult => spresult.MpAssessResult == EcSpStatus.published).ToList();
            //    gm.AssessorStratResponse.Select(stresp => stresp.)
            //});

            //Go through the returned GroupMembers and remove:
            //-GroupMembers (on this group), AssessorSpResponses, AssessorStratResponses, and AuthorOfComment flagged as deleted
            //-AssessResults and StratResults if the Group status isn't Published
            //then return the filtered GroupMember object to the list
            groupMems = groupMems.Select(gm => 
            {
                gm.Group.Members =  gm.Group.Members.Where(member => !member.IsDeleted).ToList();
                gm.AssessorSpResponses = gm.AssessorSpResponses.Where(resp => !resp.IsDeleted).ToList();
                gm.AssessorStratResponse = gm.AssessorStratResponse.Where(resp => !resp.IsDeleted).ToList();
                gm.AuthorOfComments = gm.AuthorOfComments.Where(aoc => !aoc.IsDeleted).ToList();

                if (gm.Group.MpSpStatus != EcSpStatus.published)
                {
                    gm.AssessResults = null;
                    gm.StratResults = null;
                }

                return gm;

                //return new EcGroupMember {
                //    Group = gm.Group,
                //    AssessorSpResponses = gm.AssessorSpResponses.Where(spresp => spresp.IsDeleted == false).ToList(),
                //    AssessorStratResponse = gm.AssessorStratResponse.Where(stresp => stresp.IsDeleted == false).ToList(),
                //    AuthorOfComments = gm.AuthorOfComments.Where(aoc => aoc.IsDeleted == false).ToList(),
                //    AssessResults = gm.AssessResults.Where(spresult => spresult.GrpMember.Group.MpSpStatus == EcSpStatus.published).ToList(),
                //    StratResults = gm.StratResults.Where(stresult => stresult.GrpMember.Group.MpSpStatus == EcSpStatus.published).ToList()
                //}
            
            }).ToList();

            //groupMems.ForEach(gm =>
            //{
            //    if (gm.Group.MpSpStatus != EcSpStatus.published)
            //    {
            //        gm.AssessResults = null;
            //        gm.StratResults = null;
            //    }
            //});

            return groupMems;
        }

        public SaveResult BzSave(JObject saveBundle)
        {
            return _studentRepo.BzSave(saveBundle, User);
        }

        //public IEnumerable<ISoftDelete> PruneList(IEnumerable<ISoftDelete> items)
        //{
        //    return items.Where(item => !item.IsDeleted);

        //}
    }
}
