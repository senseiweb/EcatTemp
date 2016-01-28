using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Ecat.Models
{
    /// <summary>
    /// Represent the generic person object used in ECAT.
    ///  <remarks>
    ///     if changing the property names in this class be sure to update the UserSaveGuard list of properties that the users are allowed to change.
    /// </remarks>
    /// </summary>
    /// 
    [PersonMappedPropValid]
    public class EcPerson : IAuditable
    {
        public int PersonId { get; set; }

        [UserSg("IsEnabled", UserRoleType.Admin)]
        public bool IsEnabled { get; set; }

        [JsonIgnore]
        [UserSg("BbUserId", UserRoleType.Admin)]
        public string BbUserId { get; set; }

        [JsonIgnore]
        [UserSg("BbUserName", UserRoleType.Admin)]
        public string BbUserName { get; set; }

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
        [EmailAddress(ErrorMessage ="A properly formed email address is required")]
        public string Email { get; set; }

        [UserSg("IsRegistrationComplete", UserRoleType.Admin)]
        public bool IsRegistrationComplete { get; set; }

        [UserSg("MpInstituteRole", UserRoleType.Admin)]
        public string MpInstituteRole { get; set; }

        public virtual EcStudent Student { get; set; }
        public virtual EcFacilitator Facilitator  { get; set; }
        public virtual EcExternal External { get; set; }
        public virtual EcSecurity Security { get; set; }

        public ICollection<EcCourseMember> Courses { get; set; }

        [JsonIgnore]
        public int? ModifiedById { get; set; }
        [JsonIgnore]
        public DateTime ModifiedDate { get; set; }
        [JsonIgnore]
        public EcPerson ModifiedBy { get; set; }
    }
}
