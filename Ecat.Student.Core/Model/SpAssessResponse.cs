using System;
using Ecat.Designer.Core.Model;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Model;
using Ecat.Student.Core.Model.RefOnly;

namespace Ecat.Student.Core.Model
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
        public StudInGroup Assessor { get; set; } 
        public StudInGroup Assessee { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
