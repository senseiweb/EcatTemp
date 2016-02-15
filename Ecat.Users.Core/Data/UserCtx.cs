using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core;
using Ecat.Shared.DbManager.Config;
using Ecat.Shared.Model;

namespace Ecat.Users.Core
{
    public class UserCtx : EcatBaseContext<UserCtx>
    {
        
        protected override void OnModelCreating(DbModelBuilder mb)
        {

            Database.Log = s => Debug.WriteLine(s);

            mb.Configurations.Add(new ConfigPerson());
            mb.Configurations.Add(new ConfigPersonProfile());
            mb.Configurations.Add(new ConfigPersonSecurity());
            mb.Ignore<MeetingAttendee>();
            mb.Ignore<MemberInGroup>();
            mb.Ignore<MemberInCourse>();

            base.OnModelCreating(mb);
        }

        public IDbSet<Person> People { get; set; }
        public IDbSet<Profile> Profiles { get; set; } 
        public IDbSet<Student> Students { get; set; }
        public IDbSet<Facilitator> Facilitators { get; set; }
        public IDbSet<External> Externals { get; set; }
        public IDbSet<Security> Securities { get; set; }
    }
}
