using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;
using FacCore.Interface;

namespace FacCore.Business
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

        public IQueryable<MemberInGroup> GetWorkGroupById(int groupId)
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
