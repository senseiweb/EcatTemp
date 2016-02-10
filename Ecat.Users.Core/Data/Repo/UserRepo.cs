using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider.EF6;

namespace Ecat.Users.Core
{
    public class UserRepo : IUserRepo
    {
        private readonly UserCtx _userCtx;
        private readonly EFContextProvider<UserCtx> _efCtx;

        public string GetMetadata => _efCtx.Metadata();

        public UserRepo(UserCtx userCtx, EFContextProvider<UserCtx> efCtx)
        {
            _userCtx = userCtx;
            _efCtx = efCtx;
        }

        public IQueryable FindUser(int id)
        {
            return _userCtx
        }
    }
}
