using Ecat.Shared.Core;

namespace Ecat.Shared.Model
{
    public interface IInstrument: IAuditable
    {
        int Id { get; set; }
        string Version { get; set; }
        bool IsActive { get; set; }
    }
}
