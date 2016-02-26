using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Designer;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Learner
{
    [TsClass(Module = "ecat.entity.s.learner")]
    public class SanitizedSpResponse
    {
        public int Id { get; set; }
        public string ResultEntityId { get; set; }
        public bool IsInstructorResponse { get; set; }
        public bool IsSelfResponse { get; set; }
        public string PeerGenericName { get; set; }
        public string MpItemResponse { get; set; }
        public float ItemModelScore { get; set; }
        public int InventoryItemId { get; set; }
        public int AssessResultId { get; set; }

        public SpInventory InventoryItem { get; set; }
        public SpResult Result { get; set; }
    }
}
