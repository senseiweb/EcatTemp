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
    SuccessNoResult
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

export class EcSpItemResponse {
    static Iea = 'IEA';
    static Ieu = 'IEU';
    static Nd = 'ND';
    static Eu = 'EU';
    static Ea = 'EA';
    static Heu = 'HEU';
    static Hea = 'HEA';
}

export class EcMapApiResource
{
    static user = 'User';
    static mock = 'Mock';
    static student = 'Student';
    static facilitator = 'Facilitator';
    static sa = 'SysAdmin';
    static courseAdmin = 'CourseAdmin';
    static designer = 'Designer';
}

export class EcMapAlertType {
    static info = 'info';
    static danger = 'danger';
    static success = 'success';
    static warning = 'warning';
    static default = 'inverse';
}

export class EcMapEdLevel {
    static cla = 'Chief Leadership Academy';
    static sncoa = 'Senior NCO Academy';
    static ncoa = 'NCO Academy';
    static als = 'Airman Leadership';
    static epmeic = 'EPMEIC';
    static none = 'None';
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
    static person = 'Person';
    static security = 'Security';
    static loginTk = 'LoginToken';
    static facProfile = 'Faciliatator';
    static hqStaffProfile = 'HqStaff';
    static studProfile = 'Student';
    static externalProfile = 'External';
    static course = 'Course';
    static academy = 'Academy';
    static group = 'WorkGroup';
    static grpMember = 'MemberInGroup';
    static crseMember ='MemberInCourse';
    static spInstr = 'SpInstrument';
    static kcInstr = 'KcInstrument';
    static ecInstr = 'Instrument';
    static spComment = 'SpComment';
    static ecInventory = 'Inventory';
    static kcResult = 'KcResult';

}

export class SweetAlertTypes {
    static success = 'success';
    static warn = 'warning';
    static err = 'error';
    static info = 'info';
    static input = 'input';
}

export const enum AuthHeaderType {
    CourseMember,
    Facilitator
}

export class MpSpStatus {

  static und = 'Udr';
  static open = 'Open';
  static underReview = 'Under Review';
  static published = 'Published';
  static arch = 'ArchiveE';
}

export enum Keycode {
    Enter = 13,
    Escape = 27,
    A = 65,
    B = 66,
    C = 67,
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
    RegNotComplete,
    MetadataFailure
}

