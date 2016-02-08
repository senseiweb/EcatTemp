using System;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Model;
using Ecat.Student.Core.Interface;
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
        public StudSpInventory InventoryItem { get; set; }
        public MemberInGroup Assessor { get; set; } 
        public MemberInGroup Assessee { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
