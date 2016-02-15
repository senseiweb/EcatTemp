using System;
using System.Collections.Generic;
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

        public Task<IEnumerable<Course>> GetCrsesWithLastGrpMem()
        {
            throw new NotImplementedException();
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
