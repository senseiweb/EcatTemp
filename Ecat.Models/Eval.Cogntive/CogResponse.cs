using System;

namespace Ecat.Models
{
    public class CogResponse : ISoftDelete
    {
        public int Id { get; set; }
        public int CogInventoryItem { get; set; }
        public float ItemScore { get; set; }

        public bool IsDeleted { get; set; }
        public int? DeletedById { get; set; }
        public DateTime? DeletedDate { get; set; }
        public EcPerson DeletedBy { get; set; }
    }
}
