namespace Ecat.Shared.Model
{
    [SaveGuard(new[] { GuardType.UserGuard })]
    public class External : Profile
    {
        public Person Person { get; set; }

    }
}
