using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Ecat.Shared.Model
{
    /// <summary>
    /// Represent the main user object for Ecat
    /// </summary>
    /// <remarks>
    /// Note! After making changes to any the property name's be sure to update user saveguard with the array of element LTI user are not allowed to changes such as Last, First name as these are controlled by the LMS.
    /// </remarks>
    /// <see cref="GuardUser.BeforeSaveEntities"/>
    
    [UserGuard]
    public class Person
    {
        public int PersonId { get; set; }
        public bool IsActive { get; set; }

        [JsonIgnore]
        public string BbUserId { get; set; }

        [JsonIgnore]
        public string BbUserName { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string AvatarLocation { get; set; }
        public string GoByName { get; set; }
        public string MpGender { get; set; }
        public string MpAffiliation { get; set; }
        public string MpPaygrade { get; set; }
        public string MpComponent { get; set; }
        public string Email { get; set; }
        public bool RegistrationComplete { get; set; }
        public string MpInstituteRole { get; set; }

        public virtual Student Student { get; set; }
        public virtual Facilitator Facilitator { get; set; }
        public virtual External External { get; set; }
        public virtual HqStaff HqStaff { get; set; }
        public virtual Security Security { get; set; }


        [JsonIgnore]
        public int? ModifiedById { get; set; }
        [JsonIgnore]
        public DateTime ModifiedDate { get; set; }
    }
}
