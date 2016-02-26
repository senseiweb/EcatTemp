using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Core.Utility
{
    /// <summary>
    /// Warning: Flags variables are stored in the database and use to represent values. 
    /// Changing the values here will make interperting previously stored 
    /// records impossible.
    /// </summary>
    public enum AuthHeaderType
    {
        Undefined = 0,
        CourseMember,
        GroupMember,
    }

    public enum RoleMap
    {
        Unknown = 0,
        SysAdmin,
        Designer,
        CrseAdmin,
        Facilitator,
        Student,
        External,
        RefOnly
    }

    public enum GuardType
    {
        UserGuard,
        StudentGuard,
        FacilitatorGuard,
        CrseAdminGuard,
        SysAdminGuard
    }

    [Flags]
    public enum EdLevel
    {
        None = 0,
        Chief = 1 << 1,
        Senior = 1 << 2,
        Ncoa = 1 << 3,
        Airman = 1 << 4,
        Instructor = 1 << 5
    }

    [Flags]
    public enum GroupType
    {
        None = 0,
        Bc1 = 1 << 1,
        Bc2 = 1 << 2,
        Bc3 = 1 << 3,
        Bc4 = 1 << 4
    }

    //HACK: Think of a better in case more schools are needed!
    public enum AcademyBase
    {
        None = 0,
        Gunter,
        Keesler,
        Lackland,
        Peterson,
        Tyndall,
        Sheppard,
        McGheeTyson,
        Elmendorf,
        Hickam,
        Kadena,
        Kisling
    }
}
