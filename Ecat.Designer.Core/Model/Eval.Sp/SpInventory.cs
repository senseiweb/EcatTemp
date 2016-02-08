using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Designer.Core.Interface;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Model;

namespace Ecat.Designer.Core.Model
{
    /// <summary>
    /// Save Rules to consider: If !isDisplayed, ensure that isScored is set to false;
    /// </summary>
    public class SpInventory : IAuditable, IInventory<SpInstrument>
    {
        public int Id { get; set; }
        public int InstrumentId { get; set; }
        public int? ModifiedById { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsScored { get; set; }
        public bool IsDisplayed { get; set; }
        public string Behavior { get; set; }
        public DateTime ModifiedDate { get; set; }

        public SpInstrument Instrument { get; set; }
    }
}
