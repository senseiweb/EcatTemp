using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.Staff.MeetingTaker;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.DbMgr.Config;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.UserMod.Core
{
    public class UserCtx : ContextBase<UserCtx>
    {
        protected override void OnModelCreating(DbModelBuilder mb)
        {


            mb.Configurations.Add(new ConfigPerson());
            mb.Configurations.Add(new ConfigProfileStudent());
            mb.Configurations.Add(new ConfigProfileFaculty());
            mb.Configurations.Add(new ConfigProfileStaff());
            mb.Configurations.Add(new ConfigProfileDesigner());
            mb.Configurations.Add(new ConfigProfileExternal());
            mb.Configurations.Add(new ConfigSecurity());

            mb.Entity<LoginToken>().HasKey(p => p.PersonId);

            mb.Ignore<MeetingAttendee>();
            mb.Ignore(new List<Type>
            {
                typeof(MemReconResult),
                typeof(FacultyInCourse),
                typeof(MeetingAttendee),
                typeof(StudentInCourse),
                typeof(CrseStudentInGroup)
            });

            base.OnModelCreating(mb);
        }

        public IDbSet<Person> People { get; set; }
        public IDbSet<ProfileStudent> Students { get; set; }
        public IDbSet<ProfileFaculty> Facilitators { get; set; }
        public IDbSet<ProfileExternal> Externals { get; set; }
        public IDbSet<ProfileDesigner> Designers { get; set; } 
        public IDbSet<ProfileStaff> Staff { get; set; }
        public IDbSet<LoginToken> LoginTokens { get; set; }
    }

}
