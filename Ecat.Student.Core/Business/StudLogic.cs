using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;
using Ecat.Student.Core.Interface;

namespace Ecat.Student.Core.Business
{
    public class StudLogic : IStudLogic
    {
        public Person CurrentStudent { get; set; }
        public MemberInCourse CurrentCrsMem { get; set; }
        private readonly IStudRepo _repo;

        public string GetMetadata => _repo.GetMetadata;

        public StudLogic(IStudRepo repo)
        {
            _repo = repo;
        }

        



    }
}
