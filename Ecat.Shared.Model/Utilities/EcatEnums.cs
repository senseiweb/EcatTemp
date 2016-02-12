using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
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

    public enum EdLevel
    {
        None = 0,
        Chief = 1 << 1,
        Senior = 1 << 2,
        Ncoa = 1 << 3,
        Airman = 1<< 4,
        Instructor = 1 << 5
    }

    //HACK: Think of a better in case more schools are needed!
    public enum AcademyBase
    {
        None = 0,
        Gunter = 1 << 1,
        Keesler = 1 << 2,
        Lackland = 1 << 3,
        Peterson = 1 << 4,
        Tyndall = 1 << 5,
        Sheppard = 1 << 6,
        McGheeTyson = 1 << 7,
        Elmendorf = 1 << 8 ,
        Hickam = 1 << 9,
        Kadena = 1 << 10,
        Kisling = 1 << 11,
    }

}
