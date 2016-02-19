using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Ecat.Stud.Core.Interface;
using Newtonsoft.Json.Linq;

namespace Ecat.Stud.Core.Business
{
    public class StudLogic : IStudLogic
    {
        private readonly IStudRepo _repo;
        public Person Student { get; set; }

        public StudLogic(IStudRepo repo)
        {
            _repo = repo;
        }

        public SaveResult ClientSave(JObject saveBundle)
        {
            throw new NotImplementedException();
        }

        public async Task<List<MemberInCourse>> GetCrsesWithLastestGrpMem()
        {
           var courseMems = await _repo.GetCrseMembership
                .Where(cm => cm.PersonId == Student.PersonId)
                .ToListAsync();

            if (!courseMems.Any())
            {
                return null;
            }

            var latestCrseMem = courseMems.First();

            var lastGroupMem = await _repo.GetSingleGrpMemberships
                .Where(gm => gm.CourseEnrollmentId == latestCrseMem.Id).ToListAsync();

            latestCrseMem.StudGroupEnrollments = lastGroupMem;

            return courseMems;
        }

        public async Task<MemberInCourse> GetCrseMemById(int crseMemId)
        {
            var crseMem = await _repo.GetCrseMembership
                .Where(cm => cm.Id == crseMemId)
                .Include(cm => cm.StudGroupEnrollments
                    .OrderByDescending(gm => gm.Group.MpCategory)
                    .FirstOrDefault())
                .Include(cm => cm.StudGroupEnrollments.SelectMany(gm => gm.GroupPeers))
                .SingleAsync();

            return crseMem;
        }

        public async Task<MemberInGroup> GetGrpMemById(int grpMemId)
        {
            var grpMem = await _repo.GetSingleGrpMemberships
                .Where(gm => gm.Id == grpMemId)
                .SingleAsync();

            return grpMem;
        }


        public string GetMetadata => _repo.GetMetadata;


        



    }
}
