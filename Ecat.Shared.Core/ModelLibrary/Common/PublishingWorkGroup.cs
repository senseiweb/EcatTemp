using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;

namespace Ecat.Shared.Core.ModelLibrary.Common
{
    public class PubWg
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public int CountInventory { get; set; }
        public int? InstrumentId { get; set; }
        public float WgSpTopStrat  { get; set; }
        public float WgFacTopStrat { get; set; }
        public float StratDivisor { get; set; }
        public IEnumerable<PubWgMember> PubWgMembers { get; set; } 
    }

    public class PubWgMember
    {
        public int StudentId { get; set; }
        public string Name { get; set; }
        public float SpResponseTotalScore { get; set; }
        public int FacStratPosition { get; set; }   
        public bool HasSpResult { get; set; }
        public bool HasStratResult { get; set; }
        public StratResult StratResult { get; set; }
        public IEnumerable<int> PeersDidNotAssessMe { get; set; }
        public IEnumerable<int> PeersIdidNotAssess { get; set; }
        public IEnumerable<int> PeersDidNotStratMe { get; set; }
        public IEnumerable<int> PeersIdidNotStrat { get; set; }
        public IEnumerable<PubWgStratTable> StratTable { get; set; }
    }

    public class PubWgStratTable
    {
        public int Position { get; set; }
        public int Count { get; set; }  
    }
    
}
