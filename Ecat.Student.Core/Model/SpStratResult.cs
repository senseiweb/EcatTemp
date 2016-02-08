using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Model;

namespace Ecat.Student.Core.Model
{
    public class SpStratResult
    {
        public int Id { get; set; }
        public int GrpMemberId { get; set; }
        public int FacStratResponseId  { get; set; }
        public int OriginalStratPosition { get; set; }
        public int FinalStratPosition { get; set; }
        public float StratScore { get; set; }

        public Person GrpMember { get; set; }
        public ICollection<SpStratResponse> SourceResponses { get; set; }
    }
}
