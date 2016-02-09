namespace Ecat.Models
{
    public class KcResponse
    {
        public int Id { get; set; }
        public int InventoryId { get; set; }
        public int? ResultId { get; set; }
        public bool IsCorrect { get; set; }

        public KcResult Result { get; set; }
        public KcInventory Inventory { get; set; }
    }
}
