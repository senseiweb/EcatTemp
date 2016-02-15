using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    public class SpAssessMap : AssessMap
    {
        public int SpInstrumentId { get; set; }
        public SpInstrument  SpInstrument { get; set; }
    }
}
