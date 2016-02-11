using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    public enum AuthHeaderType
    {
        Undefined = 0,
        CourseMember,
        Facilitator
    }

    public enum RoleMap
    {
        Unknown = 0,
        SysAdmin,
        Designer,
        CrseAdmin,
        Facilitator,
        Student,
        External
    }

    public enum GuardType
    {
        UserGuard,
        StudentGuard,
        FacilitatorGuard,
        CrseAdminGuard,
        SysAdminGuard
    }
}
