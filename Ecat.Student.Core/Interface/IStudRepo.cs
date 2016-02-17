using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecat.Shared.Core;
using Ecat.Shared.Model;

namespace Ecat.Student.Core.Interface
{
    public interface IStudRepo
    {
        string GetMetadata { get; }
        IQueryable<MemberInCourse> GetCrseMembership(int crseMemId);
        IQueryable<MemberInGroup> GetGrpMemberships(int grpMemberId);
    }
}