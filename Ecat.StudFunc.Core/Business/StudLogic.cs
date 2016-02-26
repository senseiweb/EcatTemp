using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.StudFunc.Core.Inteface;
using Newtonsoft.Json.Linq;

namespace Ecat.StudFunc.Core.Business
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

        IQueryable<StudentInCourse> IStudLogic.GetCrsesWithLastestGrpMem()
        {
            throw new NotImplementedException();
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
