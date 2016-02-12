namespace Ecat.Shared.Model
{
    [UserGuard]
    public class Facilitator: Profile
    {
        public Person Person { get; set; }
        public bool IsCourseAdmin { get; set; }
    }
}
