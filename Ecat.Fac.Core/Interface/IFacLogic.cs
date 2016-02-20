using System.Linq;
using Ecat.Shared.Model;

namespace Ecat.Fac.Core.Interface
{
    public interface IFacLogic
    {
        Person Facilitator { get; set; }
        string GetMetadata { get; }
        IQueryable<MemberInCourse> GetCrsesWithLastestGrpMem();
        IQueryable<MemberInGroup> GetMemberGroupById();
    }
}
