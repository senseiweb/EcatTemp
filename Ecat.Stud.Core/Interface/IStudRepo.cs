using System.Linq;
using Ecat.Shared.Model;

namespace Ecat.Stud.Core.Interface
{
    public interface IStudRepo
    {
        string GetMetadata { get; }
        IQueryable<MemberInCourse> GetCrseMembership { get; }
        IQueryable<MemberInGroup> GetSingleGrpMemberships { get; }
    }
}