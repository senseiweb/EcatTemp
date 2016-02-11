namespace Ecat.Shared.Model
{
    [SaveGuard(new[] { GuardType.UserGuard })]
    public class Student : Profile
    {
        public Person Person { get; set; }
    }
}
