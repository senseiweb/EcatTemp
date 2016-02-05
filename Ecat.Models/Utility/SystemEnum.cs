using System;

namespace Ecat.Models
{
    [Flags]
    public enum AssessTarget
    {
        None = 0,
        Als = 1,
        Ncoa = 2,
        Sncoa = 4,
        Clc = 8,
        Epmeic = 16,
        Wg1 = 32,
        Wg2 = 64,
        Wg3 = 128,
        Wg4 = 256,
        AllEdLevel = Als | Ncoa | Sncoa |  Clc | Epmeic,
        AllWg = Wg1 | Wg2 | Wg3 | Wg4
    }

    public enum AuthHeaderType
    {
        Undefined = 0,
        CourseMember,
        Facilitator
    }

    public enum EcRoles
    {
        Unknown = 0,
        SysAdmin,
        Designer,
        CrseAdmin,
        Facilitator,
        Student,
        External
    }

    public enum EpmeSchool
    {
        Bcee,
        Afsncoa,
        Clc,
        Ncoa,
        Keesler,
        Sheppard,
        Tyndall,
        Epmeic
    }

    public enum UserRoleType
    {
        Admin,
        BbDefined,
        External
    }

    public enum EcGenderType
    {
        Unknown = 0,
        Male,
        Female,
        Other
    }

    public enum EcRoleType
    {
        Undefined = 0,
        Course,
        Institute,
        Ecat
    }

    public enum SpResponseEnum
    {
        Undefined = 0,
        IeAlways,
        IeUsually,
        NotDisplayed,
        EffUsually,
        EffAlways,
        HeUsually,
        HeAlways
    }

    public enum GroupInstrPublishStatus
    {
        Undefined = 0,
        Open,
        UnderReview,
        Published,
        Archive
    }

    public enum SpResultCode
    {
        Undefined = 0,
        Ineff,
        BelowAvg,
        Eff,
        AboveAvg,
        HighEff
    }

    public enum CourseFilterType
    {
        LoadAll = 0,
        LoadByCourseId,
        LoadByBatchUid,
        LoadById,
        LoadByCatId,
        LoadBySearchKey
    }

    public enum MembershipFilterType
    {
        LoadById = 1,
        LoadByCourseId = 2,
        LoadByUserId = 5,
        LoadByCourseAndUserId = 6,
        LoadByCourseAndRole = 7
    }

    public enum UserFilterType
    {
        AllUsersWithAvailability = 1,
        UserByIdWithAvailability,
        UserByBatchIdWithAvailability,
        UserByCourseIdWithAvailability,
        UseByGroupIdWithAvailability,
        UserByNameWithAvailability,
        UserBySystemRole
    }

    public enum CourseSearchKey
    {
        CourseId,
        CourseName,
        CourseDescription,
        CourseInstructor
    }

    public enum SearchOperator
    {
        Equals,
        Constains,
        StartsWith,
        IsNotBlank
    }

    public enum SearchDateOperator
    {
        GreaterThan,
        LessThan
    }

}
