namespace Ecat.Models
{
    public interface IInstrument: IAuditable
    {
        int Id { get; set; }
        string Version { get; set; }
        bool IsActive { get; set; }
    }
}
