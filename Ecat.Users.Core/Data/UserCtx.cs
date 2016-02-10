using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core;
using Ecat.Shared.Model;

namespace Ecat.Users.Core
{
    public class UserCtx : EcatBaseContext<UserCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {
            
            base.OnModelCreating(mb);
        }

        public IDbSet<Person> People { get; set; }
        public IDbSet<Student> Students { get; set; }
        public IDbSet<Facilitator> Facilitators { get; set; }
        public IDbSet<External> Externals { get; set; }
        public IDbSet<Security> Securities { get; set; }
    }
}
