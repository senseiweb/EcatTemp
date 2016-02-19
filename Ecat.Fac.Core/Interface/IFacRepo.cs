using System.Linq;
using Ecat.Shared.Model;

namespace Ecat.Fac.Core.Interface
{
    public interface IFacRepo
    {
        string Metadata { get; }
        IQueryable<MemberInCourse> GetCrseMembership { get; }
        IQueryable<MemberInGroup> GetAllWorkGroupData { get; }
    }
}
