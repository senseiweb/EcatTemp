namespace Ecat.Shared.Model
{
    [UserGuard]
    public class External : Profile
    {
        public virtual Person Person { get; set; }

    }
}
