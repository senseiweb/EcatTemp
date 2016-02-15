namespace Ecat.Shared.Model
{
    public class EcExternalGroup
    {
        public int Id { get; set; }
        public int FacilitatorId { get; set; }
        public string Base { get; set; }
        public string Unit { get; set; }

        public Person Facilitator { get; set; }
    }
}