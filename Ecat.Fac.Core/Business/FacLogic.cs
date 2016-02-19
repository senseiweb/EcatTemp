using System.Data.Entity;
using System.Linq;
using Ecat.Fac.Core.Interface;
using Ecat.Shared.Model;

namespace Ecat.Fac.Core.Business
{
    public class FacLogic : IFacLogic
    {
        private readonly IFacRepo _repo;
        public Person Facilitator { get; set; }

        public FacLogic(IFacRepo repo)
        {
            _repo = repo;
        }

        public string GetMetadata => _repo.Metadata;

        public IQueryable<MemberInCourse> GetCrsesWithLastestGrpMem()
        {
            return _repo.GetCrseMembership
                .Where(crseMem => crseMem.PersonId == Facilitator.PersonId)
                .Include(crse => crse.Course.Groups);
        }

        public IQueryable<MemberInGroup> GetWorkGroupById()
        {
            return _repo.GetAllWorkGroupData;

            //return _repo.GetAllWorkGroupData
            //    .Where(g => g.Group.Course.CourseMembers
            //        .Any(
            //            cm =>
            //                cm.PersonId == Facilitator.PersonId &&
            //                (cm.MpCourseRole == MpCourseRole.Facilitator || cm.MpCourseRole == MpCourseRole.CrseAdmin)) &&
            //                g.Group.Id == groupId);

        }
    }
}
