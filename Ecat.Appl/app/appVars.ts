﻿export enum AppNames {
    Core,
    Admin,
    Instructor,
    Student
}

export enum TokenStatus {
    Missing,
    Expired,
    Valid
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

export class EcMapGender {
    static unk = 'Unknown';
    static male = 'Male';
    static female = 'Female';
    static other = 'Other';
}

export class EcMapAffiliation {
    static usaf = 'Air Force';
    static usa = 'Army';
    static uscg = 'Coast Guard';
    static usn = 'Navy';
    static usmc = 'Marines';
    static fn = 'Foreign National';
    static none = 'Unaffiliated';
    static unk = 'Unknown';
}

export class EcMapComponent {
    static active = 'Active Duty';
    static reserve = 'Reserves';
    static guard = 'National Guard';
    static none = 'Unaffiliated';
    static unk = 'Unknown';
}

export class EcMapPaygrade {
    static e1 = 'E1';
    static e2 = 'E2';
    static e3 = 'E3';
    static e4 = 'E4';
    static e5 = 'E5';
    static e6 = 'E6';
    static e7 = 'E7';
    static e8 = 'E8';
    static e9 = 'E9';
    static civ = 'Civilian';
    static fn = 'Foreign National';
    static unk = 'Unknown';
}

export class EcMapApiResource
{
    static user = 'user';
    static student = 'student';
    static instructor = 'instructor';
    static admin = 'admin';
    static courseAdmin = 'courseAdmin';
}

export class EcMapAlertType {
    static info = 'info';
    static danger = 'danger';
    static success = 'success';
    static warning = 'warning';
    static default = 'inverse';
}

export class EcMapInstituteRole
{
    static hqAdmin = 'BCEE_01_HQ';
    static designer = 'BCEE_02_Designer';
    static courseAdmin = 'BCEE_03_CourseAdmin';
    static facilitator = 'BCEE_04_Facilitator';
    static student = 'BCEE_05_Student';
    static external = 'BCEE_06_External';
}

export class EcMapAnimationsEnum {
    static fadeIn = 'fadeIn';
    static fadeInLeft = 'fadeInLeft';
    static fadeInRight = 'fadeInRight';
    static fadeInUp = 'fadeInUp';
    static fadeInDown = 'fadeInDown';
    static bounceIn = 'bounceIn';
    static bounceInLeft = 'bounceInLeft';
    static bounceInRight = 'bounceInRight';
    static bounceInUp = 'bounceInUp';
    static rotateInDownRight = 'rotateInDownRight';
    static rotateIn = 'rotateIn';
    static flipInX = 'flipInX';
    static flipInY = 'flipInY';
    static fadeOut = 'fadeOut';
    static fadeOutLeft = 'fadeOutLeft';
    static fadeOutRight = 'fadeOutRight';
    static fadeOutUp = 'fadeOutUp';
    static fadeOutDown = 'fadeOutDown';
    static bounceOut = 'bounceOut';
    static bounceOutLeft = 'bounceOutLeft';
    static bounceOutRight = 'bounceOutRight';
    static bounceOutUp = 'bounceOutUp';
    static rotateOutUpRight = 'rotateOutUpRight';
    static rotateOut = 'rotateOut';
    static flipOutX = 'flipOutX';
    static flipOutY = 'flipOutY';
}

export class EcMapEntityType {
    static unk = 'Unknown';
    static person = 'EcPerson';
    static security = 'EcSecurity';
    static loginTk = 'LoginToken';
    static facProfile = 'EcInstructor';
    static studProfile = 'EcStudent';
    static externalProfile = 'EcExternal';
    static course = 'EcCourse';
    static academy = 'EcAcademy';
    static group = 'EcGroup';
    static spInstr = 'SpInstrument';
    static kcInstr = 'KcInstrument';
    static ecInstr = 'EcInstrument';
    static spComment = 'SpComment';
    static ecInventory = 'EcInventory';
    static kcResult = 'KcResult';

}

export enum Keycode {
    Enter = 13,
    Escape = 27,
    A = 65,
    B = 66,
    c = 67,
    D = 68,
    E = 69,
    F = 70
}

export enum EntityTypes {
    SpAssessResult,
    SpAssessResponse,
    SpInventory,
    SpStratResponse,
    SpStratResult,
    EcGroupMember,
    EcCourseMember,
    EcGroupTypeInstrumnet
}

export enum SysErrorType {
    Undefined,
    AuthNoToken,
    AuthExpired,
    NotAuthorized,
    RegNotComplete
}

