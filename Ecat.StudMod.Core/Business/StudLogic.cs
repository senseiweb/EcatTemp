using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public class StudLogic : IStudLogic
    {
        private readonly IStudRepo _repo;

        public Person StudentPerson { get; set; }

        public StudLogic(IStudRepo repo)
        {
            _repo = repo;
        }

        public SaveResult ClientSave(JObject saveBundle)
        {
            var neededSaveGuards = new List<Guard>();

            if (StudentPerson.MpInstituteRole != MpInstituteRoleName.HqAdmin)
            {
                //var userGuard = new GuardUserSave(User);
                //neededSaveGuards.Add(userGuard.BeforeSaveEntities);
            }

            return _repo.ClientSaveChanges(saveBundle, neededSaveGuards);
        }

        public IQueryable<CrseStudentInGroup> GetCrsesWithLastestGrpMem()
        {
            return _repo.GetCrseMembership
                .Where(gm => gm.StudentId == StudentPerson.PersonId)
                .Include(gm => gm.WorkGroup)
                .Include(gm => gm.AuthorOfComments)
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentProfile))
                .Include(gm => gm.WorkGroup.GroupMembers.Select(p => p.StudentProfile.Person))
                .Include(gm => gm.AssessorSpResponses);
        }

        public Task<CrseStudentInGroup> GetWorkGroupDataForStudent()
        {
            throw new NotImplementedException();
        }

        //public async Task<List<MemberInCourse>> GetCrsesWithLastestGrpMem()
        //{
        //    var courseMems = await _repo.GetCrseMembership
        //         .Where(cm => cm.PersonId == Student.PersonId)
        //         .ToListAsync();

        //    if (!courseMems.Any())
        //    {
        //        return null;
        //    }

        //    var latestCrseMem = courseMems.First();

        //    var lastGroupMem = await _repo.GetSingleGrpMemberships
        //        .Where(gm => gm.CourseEnrollmentId == latestCrseMem.Id).ToListAsync();

        //    latestCrseMem.StudGroupEnrollments = lastGroupMem;

        //    return courseMems;
        //}

        //public async Task<MemberInCourse> GetCrseMemById(int crseMemId)
        //{
        //    var crseMem = await _repo.GetCrseMembership
        //        .Where(cm => cm.Id == crseMemId)
        //        .Include(cm => cm.StudGroupEnrollments
        //            .OrderByDescending(gm => gm.Group.MpCategory)
        //            .FirstOrDefault())
        //        .Include(cm => cm.StudGroupEnrollments.SelectMany(gm => gm.GroupPeers))
        //        .SingleAsync();

        //    return crseMem;
        //}

        //public async Task<MemberInGroup> GetGrpMemById(int grpMemId)
        //{
        //    var grpMem = await _repo.GetSingleGrpMemberships
        //        .Where(gm => gm.Id == grpMemId)
        //        .SingleAsync();

        //    return grpMem;
        //}


        public string GetMetadata => _repo.GetMetadata;






    }
}
