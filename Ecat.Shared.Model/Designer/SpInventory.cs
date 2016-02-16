using System;
using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    /// <summary>
    /// Save Rules to consider: If !isDisplayed, ensure that isScored is set to false;
    /// </summary>
    public class SpInventory : IAuditable, IInventory<SpInstrument>
    {
        public int Id { get; set; }
        public int InstrumentId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsScored { get; set; }
        public bool IsDisplayed { get; set; }
        public string Behavior { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }

        public SpInstrument Instrument { get; set; }
    }
}
