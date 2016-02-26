using System;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Cognitive
{
    [TsClass(Module ="ecat.entity.s.cog")]
    public class CogResponse
    {
        public int Id { get; set; }
        public int CogInventoryItem { get; set; }
        public float ItemScore { get; set; }
        [TsIgnore]
        public bool IsDeleted { get; set; }
        [TsIgnore]
        public int? DeletedById { get; set; }
        [TsIgnore]
        public DateTime? DeletedDate { get; set; }
    }
}
