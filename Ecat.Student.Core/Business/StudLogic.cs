using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;
using Ecat.Student.Core.Interface;
using Newtonsoft.Json.Linq;

namespace Ecat.Student.Core.Business
{
    public class StudLogic : IStudLogic
    {
        private readonly IStudRepo _repo;
        public Person Student { get; set; }
        public MemberInCourse CrsMem { get; set; }
        public MemberInGroup GrpMem { get; set; }

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
           var courseMems = await _repo.GetCrseMembership(Student.PersonId)
                .OrderByDescending(crseMem => crseMem.Course.StartDate)
                .Include(c => c.Course)
                .ToListAsync();

            if (!courseMems.Any())
            {
                return null;
            }

            var latestCrseMem = courseMems.First();

            var lastGroupMem = await _repo.GetGrpMemberships(latestCrseMem.Id)
                .OrderByDescending(grpMem => grpMem.Group.MpCategory)
                .Include(g => g.Group)
                .Include(g => g.GroupPeers)
                .Include(g => g.AssessorStratResponse)
                .Include(g => g.AssessorSpResponses)
                .Include(g => g.AuthorOfComments)
                .FirstOrDefaultAsync();

            latestCrseMem.StudGroupEnrollments = new List<MemberInGroup> {lastGroupMem};

            return courseMems;
        }

        public Task<IEnumerable<WorkGroup>> GetGroupsAndMemForCourse()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MemberInGroup>> GetPeersForGrp()
        {
            throw new NotImplementedException();
        }


        public string GetMetadata => _repo.GetMetadata;


        



    }
}
