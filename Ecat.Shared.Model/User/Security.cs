namespace Ecat.Shared.Model
{
    public class Security
    {
        public int PersonId { get; set; }
        public string PasswordHash { get; set; }
        public int BadPasswordCount { get; set; }
        public Person Person { get; set; }
    }
}
    