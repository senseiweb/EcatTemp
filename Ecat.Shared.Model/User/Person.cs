﻿using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Ecat.Shared.Model
{
    [SaveGuard(new []{GuardType.UserGuard})]
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
        public virtual Security Security { get; set; }


        [JsonIgnore]
        public int? ModifiedById { get; set; }
        [JsonIgnore]
        public DateTime ModifiedDate { get; set; }
    }
}
