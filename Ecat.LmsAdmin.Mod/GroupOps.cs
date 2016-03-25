using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.LmsAdmin.Mod
{
    public class GroupOps
    {
        private readonly EcatContext _mainCtx;
        private readonly BbWsCnet _bbWs;
        public ProfileFaculty Faculty { get; set; }

        public GroupOps(EcatContext mainCtx, BbWsCnet bbWs)
        {
            _mainCtx = mainCtx;
            _bbWs = bbWs;
        }


    }
}
