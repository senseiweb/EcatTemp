export const enum Keycode {
    Enter = 13,
    Escape = 27,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70
}

export enum SysErrorType {
    Undefined,
    AuthNoToken,
    AuthExpired,
    NotAuthorized,
    RegNotComplete,
    MetadataFailure
}

export enum AppNames {
    Core,
    Admin,
    Instructor,
    Student
}

export const enum TokenStatus {
    Missing,
    Expired,
    Valid
}

export const enum AlertTypes {
    Info,
    Error,
    Warning,
    Success,
    Default
}

export const enum EpmeSchool {
    Bcee = 0,
    Afsncoa = 1,
    Clc = 2,
    Ncoa = 3,
    Keesler = 4,
    Sheppard = 5,
    Tyndall = 6,
    Epmeic = 7
}

export const enum QueryError {
    UnexpectedNoResult,
    GeneralServerError,
    MissingParameter
}

export const enum SpEffectLevel {
    Unknown,
    Ineffective,
    Effective,
    HighlyEffective
}

export const enum SpFreqLevel {
    Unknown,
    Always,
    Usually
}

export const enum CompositeModelScore {
    iea = 0,
    ieu = 1,
    nd = 2,
    ea = 3,
    eu = 4,
    heu = 5,
    hea = 6
}

export const enum SpStratType {
    Instructor,
    Student
}