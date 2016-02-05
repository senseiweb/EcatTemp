﻿using System;

namespace Ecat.Models
{
    public class SpAssessResponse : IAuditable
    {
        public int Id { get; set; }
        public int AssessorId { get; set; }
        public int AssesseeId { get; set; }
        public int RelatedInventoryId { get; set; }
        public int? AssessResultId { get; set; }

        public string MpSpItemResponse { get; set; }
        public float ItemResponseScore { get; set; }
        public int ScoreModelVersion { get; set; }

        public EcGroupMember Assessor { get; set; }
        public EcGroupMember Assessee { get; set; }
        public SpInventory RelatedInventory { get; set; }
        public SpAssessResult AssessResult { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public EcPerson ModifiedBy { get; set; }
    }
}
