using System;

namespace Ecat.Models
{
    [Flags]
    public enum CtxType
    {
        None = 0,
        StudCtx = 1,
        InstrCtx = 2,
        UserCtx = 4,
        All = StudCtx | InstrCtx | UserCtx
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

    public enum EcRoleType
    {
        Undefined = 0,
        Course,
        Institute,
        Ecat
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
