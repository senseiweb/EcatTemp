namespace Ecat.Models
{
    public class EcFacilitator: IPersonProfile
    {
        public int PersonId { get; set; }
        public string Bio { get; set; }
        public EcPerson Person { get; set; }
    }
}
