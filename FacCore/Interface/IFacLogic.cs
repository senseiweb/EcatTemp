using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace FacCore.Interface
{
    public interface IFacLogic
    {
        Person Facilitator { get; set; }
        string GetMetadata { get; }
        IQueryable<MemberInCourse> GetCrsesWithLastestGrpMem();
        IQueryable<MemberInGroup> GetWorkGroupById();
    }
}
