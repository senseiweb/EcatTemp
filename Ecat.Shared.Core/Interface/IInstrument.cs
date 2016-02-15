namespace Ecat.Shared.Core
{
    public interface IInstrument : IAuditable
    {
        int Id { get; set; }
        string Version { get; set; }
        bool IsActive { get; set; }
    }
}
