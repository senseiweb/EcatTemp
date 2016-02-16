﻿using System;

namespace Ecat.Shared.Model
{
    public class FacSpAssessResponse
    {
        public int Id { get; set; }
        public int AssesseeId { get; set; }
        public int RelatedInventoryId { get; set; }
        public int? AssessResultId { get; set; }
        public int AssignedGroupId { get; set; }

        public string MpSpItemResponse { get; set; }
        public float ItemResponseScore { get; set; }
        public int ScoreModelVersion { get; set; }

        public WorkGroup AssignedGroup { get; set;  }
        public MemberInGroup Assessee { get; set; }
        public SpInventory RelatedInventory { get; set; }
        public SpAssessResult AssessResult { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }

        public int ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}