namespace Ecat.Shared.Model
{
    [SaveGuard(new[] { GuardType.UserGuard })]
    public class Facilitator: Profile
    {
        public Person Person { get; set; }

    }
}
