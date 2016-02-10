using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Users.Core.Business
{
    public class UserLogic : IUserLogic
    {
        private readonly IUserRepo _repo;

        public Person CurrentUser { get; set; }

        public string GetMetadata => _repo.GetMetadata;

        public UserLogic(IUserRepo repo)
        {
            _repo = repo;
        }

        public 


    }
}
