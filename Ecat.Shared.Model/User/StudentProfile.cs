namespace Ecat.Shared.Model
{
    [UserGuard]
    public class Student : Profile
    {
        public Person Person { get; set; }
    }
}
