using System;

namespace Ecat.Models
{
    public interface ISoftDelete
    {
        bool IsDeleted { get; set; }
        int? DeletedById { get; set; }
        DateTime? DeletedDate { get; set; }
        EcPerson DeletedBy { get; set; }
    }

    public interface IAuditable
    {
        int? ModifiedById { get; set; }
        DateTime ModifiedDate { get; set; }
        EcPerson ModifiedBy { get; set; }
    }

    public interface IPersonProfile
    {
        int PersonId { get; set; }
        EcPerson Person { get; set; }
    }
}
