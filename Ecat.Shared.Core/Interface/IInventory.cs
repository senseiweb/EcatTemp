namespace Ecat.Shared.Core
{
    public interface IInventory<T> where T : IInstrument
    {
        int Id { get; set; }
        int InstrumentId { get; set; }
        int DisplayOrder { get; set; }
        bool IsScored { get; set; }
        bool IsDisplayed { get; set; }

        T Instrument { get; set; }

    }
}
