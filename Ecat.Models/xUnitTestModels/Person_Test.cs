using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ecat.Models.xUnitTestModels
{
    public class PersonSaveguardTest
    {
        public int PersonId { get; set; }

        [UserSg("BbUserId", UserRoleType.Admin)]
        public string BbUserId { get; set; }

        [UserSg("LastName", UserRoleType.Admin, UserRoleType.External)]
        public string LastName { get; set; }

        [UserSg("FirstName", UserRoleType.Admin, UserRoleType.External)]
        public string FirstName { get; set; }

        [UserSg("AvatarLocation", UserRoleType.Admin, UserRoleType.External, UserRoleType.BbDefined)]
        public string AvatarLocation { get; set; }

        [UserSg("GoByName", UserRoleType.Admin, UserRoleType.External, UserRoleType.BbDefined)]
        public string GoByName { get; set; }

        [UserSg("MpGender", UserRoleType.Admin, UserRoleType.External, UserRoleType.BbDefined)]
        public string MpGender { get; set; }

        [UserSg("MpMilAffiliation", UserRoleType.Admin, UserRoleType.External, UserRoleType.BbDefined)]
        public string MpMilAffiliation { get; set; }

        [UserSg("MpMilPaygrade", UserRoleType.Admin, UserRoleType.External, UserRoleType.BbDefined)]
        public string MpMilPaygrade { get; set; }

        [UserSg("MpMilComponent", UserRoleType.Admin, UserRoleType.External, UserRoleType.BbDefined)]
        public string MpMilComponent { get; set; }

        [UserSg("Email", UserRoleType.Admin, UserRoleType.External, UserRoleType.BbDefined)]
        public string Email { get; set; }

        [UserSg("MpRegStatus", UserRoleType.Admin)]
        public string MpRegStatus { get; set; }

        [UserSg("MpInstituteRole", UserRoleType.Admin)]
        public string MpInstituteRole { get; set; }
    }
}