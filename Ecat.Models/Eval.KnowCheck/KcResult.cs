namespace Ecat.Models
{
    public class KcResult
    {
        public int Id { get; set; }
        public int InstrumentId { get; set; }
        public int NumberCorrect { get; set; }
        public float Score { get; set; }
        public KcInstrument Instrument { get; set; }
    }
}
