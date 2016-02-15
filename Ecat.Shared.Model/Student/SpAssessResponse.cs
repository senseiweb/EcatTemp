using System;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    public class SpAssessResponse : IAuditable
    {
        public int Id { get; set; }
        public int AssessorId { get; set; }
        public int AssesseeId { get; set; }
        public int InventoryItemId { get; set; }
        public int? AssessResultId { get; set; }

        public string MpItemResponse { get; set; }
        public float ItemModelScore { get; set; }   
        public SpInventory InventoryItem { get; set; }
        public MemberInGroup Assessor { get; set; } 
        public MemberInGroup Assessee { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
