using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace FacCore.Interface
{
    public interface IFacRepo
    {
        string Metadata { get; }
        IQueryable<MemberInCourse> GetCrseMembership { get; }
    }
}
