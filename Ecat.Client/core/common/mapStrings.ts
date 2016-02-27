
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

export class MpCommentFlag {
    static pos = "Positive";
    static neg = "Negative";
    static neut = "Netural";
}

export class MpCommentType {
    static signed = "Signed";
    static anon = "Anonymous";
}

export class EcSpItemResponse {
    static iea = 'IEA';
    static ieu = 'IEU';
    static nd = 'ND';
    static eu = 'EU';
    static ea = 'EA';
    static heu = 'HEU';
    static hea = 'HEA';
}

export class EcMapApiResource {
    static user = 'User';
    static mock = 'Mock';
    static student = 'Student';
    static faculty = 'Faculty';
    static sa = 'SysAdmin';
    static courseAdmin = 'CourseAdmin';
    static designer = 'Designer';
}

export class EcMapAlertStrings {
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

export class EcMapInstituteRole {
    static hqAdmin = 'ECAT_01_HQ';
    static designer = 'ECAT_02_Designer';
    static courseAdmin = 'ECAT_03_CourseAdmin';
    static faculty = 'ECAT_04_Faci';
    static student = 'ECAT_05_Student';
    static external = 'ECAT_06_External';
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
    static facProfile = 'ProfileFaculty';
    static hqStaffProfile = 'ProfileStaff';
    static studProfile = 'ProfileStudent';
    static externalProfile = 'Profileexternal';
    static course = 'Course';
    static academy = 'Academy';
    static workGroup = 'WorkGroup';
    static crseStudInGrp = 'CrseStudentInGroup';
    static studCrseMember = 'StudentInCourse';
    static faccultyCrseMember = 'FacultyInCourse';
    static spInstr = 'SpInstrument';
    static kcInstr = 'KcInstrument';
    static ecInstr = 'Instrument';
    static spInventory = 'SpInventory';
    static kcResult = 'KcResult';
    static spResponse = 'SpResponse';
    static spComment = 'SpComment';
    static spStrat = 'SpStrat';
    static spResult = 'SpResult';
    static facSpResponse = 'FacSpResponse';
    static facSpComment = 'FacSpComment';
    static facStratResponse = 'FacStratResponse';
}

export class MpSpComment {
    static pos = 'positive';
    static neg = 'negative';
    static neut = 'neutral';

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