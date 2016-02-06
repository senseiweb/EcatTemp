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

        public async Task<List<EcGroupMember>> GetAllGroupData(int courseMemId)
        {
            //Double check the given CourseMember is this user as a student
            //if (courseMem.PersonId != User.PersonId || courseMem.MpCourseRole != EcMapCourseRole.Student)
            //{
            //    return null;
            //}
            //TODO: Should I bother with this check?
            List<EcCourseMember> courseMems = await _studentRepo.GetCourseMems(User.PersonId);
            if (courseMems.Find(cm => cm.Id == courseMemId) == null)
            {
                throw new UnauthorizedAccessException("User is not a student on this course.");
            }

            List<EcGroupMember> groupMems = await _studentRepo.GetAllGroupData(courseMemId);

            //Go through the returned GroupMembers and remove:
            //-GroupMembers (on the group), AssessorSpResponses, AssessorStratResponses, AuthorOfComment, and RecipientOfComments flagged as deleted
            //-AssessResults and RecipientOfComments if the Group status isn't Published
            //then return the filtered GroupMember object to the list
            groupMems = groupMems.Select(gm => 
            {
                gm.Group.Members =  gm.Group.Members.Where(member => !member.IsDeleted).ToList();
                gm.AssessorSpResponses = gm.AssessorSpResponses.Where(resp => !resp.IsDeleted).ToList();
                gm.AssessorStratResponse = gm.AssessorStratResponse.Where(resp => !resp.IsDeleted).ToList();
                gm.AuthorOfComments = gm.AuthorOfComments.Where(aoc => !aoc.IsDeleted).ToList();
                gm.RecipientOfComments = gm.RecipientOfComments.Where(roc => !roc.IsDeleted).ToList();

                if (gm.Group.MpSpStatus != EcSpStatus.Published)
                {
                    gm.AssessResults = null;
                    gm.RecipientOfComments = null;
                }

                return gm;  
                          
            }).ToList();

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
