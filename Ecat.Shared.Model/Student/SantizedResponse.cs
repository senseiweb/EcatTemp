using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    public class SantizedResponse
    {
        public int Id { get; set; }
        public bool IsInstructorResponse { get; set; }
        public string PeerGenericName { get; set; }
        public string MpItemResponse { get; set; }
        public float ItemModelScore { get; set; }
        public int InventoryItemId { get; set; }
        public int AssessResultId { get; set; }

        public SpInventory InventoryItem { get; set; }
        public SpAssessResult AssessResult { get; set; }

    }
}
