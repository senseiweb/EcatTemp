﻿using System;

namespace Ecat.Models
{
    public class SpStratResponse :  IAuditable
    {
        public int Id { get; set; }
        public int AssessorId { get; set; }
        public int AssesseeId { get; set; }
        public int StratPosition { get; set; }
        public int? StratResultId { get; set; }

        public EcGroupMember Assessor { get; set; }
        public EcGroupMember Assessee { get; set; }
        public SpStratResult StratResult { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}
