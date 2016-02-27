System.register([], function(exports_1) {
    var EcMapGender, EcMapAffiliation, EcMapComponent, EcMapPaygrade, MpCommentFlag, MpCommentType, EcSpItemResponse, EcMapApiResource, EcMapAlertStrings, EcMapEdLevel, EcMapInstituteRole, EcMapAnimationsEnum, EcMapEntityType, MpSpComment, SweetAlertTypes, MpSpStatus;
    return {
        setters:[],
        execute: function() {
            EcMapGender = (function () {
                function EcMapGender() {
                }
                EcMapGender.unk = 'Unknown';
                EcMapGender.male = 'Male';
                EcMapGender.female = 'Female';
                EcMapGender.other = 'Other';
                return EcMapGender;
            })();
            exports_1("EcMapGender", EcMapGender);
            EcMapAffiliation = (function () {
                function EcMapAffiliation() {
                }
                EcMapAffiliation.usaf = 'Air Force';
                EcMapAffiliation.usa = 'Army';
                EcMapAffiliation.uscg = 'Coast Guard';
                EcMapAffiliation.usn = 'Navy';
                EcMapAffiliation.usmc = 'Marines';
                EcMapAffiliation.fn = 'Foreign National';
                EcMapAffiliation.none = 'Unaffiliated';
                EcMapAffiliation.unk = 'Unknown';
                return EcMapAffiliation;
            })();
            exports_1("EcMapAffiliation", EcMapAffiliation);
            EcMapComponent = (function () {
                function EcMapComponent() {
                }
                EcMapComponent.active = 'Active Duty';
                EcMapComponent.reserve = 'Reserves';
                EcMapComponent.guard = 'National Guard';
                EcMapComponent.none = 'Unaffiliated';
                EcMapComponent.unk = 'Unknown';
                return EcMapComponent;
            })();
            exports_1("EcMapComponent", EcMapComponent);
            EcMapPaygrade = (function () {
                function EcMapPaygrade() {
                }
                EcMapPaygrade.e1 = 'E1';
                EcMapPaygrade.e2 = 'E2';
                EcMapPaygrade.e3 = 'E3';
                EcMapPaygrade.e4 = 'E4';
                EcMapPaygrade.e5 = 'E5';
                EcMapPaygrade.e6 = 'E6';
                EcMapPaygrade.e7 = 'E7';
                EcMapPaygrade.e8 = 'E8';
                EcMapPaygrade.e9 = 'E9';
                EcMapPaygrade.civ = 'Civilian';
                EcMapPaygrade.fn = 'Foreign National';
                EcMapPaygrade.unk = 'Unknown';
                return EcMapPaygrade;
            })();
            exports_1("EcMapPaygrade", EcMapPaygrade);
            MpCommentFlag = (function () {
                function MpCommentFlag() {
                }
                MpCommentFlag.pos = "Positive";
                MpCommentFlag.neg = "Negative";
                MpCommentFlag.neut = "Netural";
                return MpCommentFlag;
            })();
            exports_1("MpCommentFlag", MpCommentFlag);
            MpCommentType = (function () {
                function MpCommentType() {
                }
                MpCommentType.signed = "Signed";
                MpCommentType.anon = "Anonymous";
                return MpCommentType;
            })();
            exports_1("MpCommentType", MpCommentType);
            EcSpItemResponse = (function () {
                function EcSpItemResponse() {
                }
                EcSpItemResponse.iea = 'IEA';
                EcSpItemResponse.ieu = 'IEU';
                EcSpItemResponse.nd = 'ND';
                EcSpItemResponse.eu = 'EU';
                EcSpItemResponse.ea = 'EA';
                EcSpItemResponse.heu = 'HEU';
                EcSpItemResponse.hea = 'HEA';
                return EcSpItemResponse;
            })();
            exports_1("EcSpItemResponse", EcSpItemResponse);
            EcMapApiResource = (function () {
                function EcMapApiResource() {
                }
                EcMapApiResource.user = 'User';
                EcMapApiResource.mock = 'Mock';
                EcMapApiResource.student = 'Student';
                EcMapApiResource.faculty = 'Faculty';
                EcMapApiResource.sa = 'SysAdmin';
                EcMapApiResource.courseAdmin = 'CourseAdmin';
                EcMapApiResource.designer = 'Designer';
                return EcMapApiResource;
            })();
            exports_1("EcMapApiResource", EcMapApiResource);
            EcMapAlertStrings = (function () {
                function EcMapAlertStrings() {
                }
                EcMapAlertStrings.info = 'info';
                EcMapAlertStrings.danger = 'danger';
                EcMapAlertStrings.success = 'success';
                EcMapAlertStrings.warning = 'warning';
                EcMapAlertStrings.default = 'inverse';
                return EcMapAlertStrings;
            })();
            exports_1("EcMapAlertStrings", EcMapAlertStrings);
            EcMapEdLevel = (function () {
                function EcMapEdLevel() {
                }
                EcMapEdLevel.cla = 'Chief Leadership Academy';
                EcMapEdLevel.sncoa = 'Senior NCO Academy';
                EcMapEdLevel.ncoa = 'NCO Academy';
                EcMapEdLevel.als = 'Airman Leadership';
                EcMapEdLevel.epmeic = 'EPMEIC';
                EcMapEdLevel.none = 'None';
                return EcMapEdLevel;
            })();
            exports_1("EcMapEdLevel", EcMapEdLevel);
            EcMapInstituteRole = (function () {
                function EcMapInstituteRole() {
                }
                EcMapInstituteRole.hqAdmin = 'ECAT_01_HQ';
                EcMapInstituteRole.designer = 'ECAT_02_Designer';
                EcMapInstituteRole.courseAdmin = 'ECAT_03_CourseAdmin';
                EcMapInstituteRole.faculty = 'ECAT_04_Faci';
                EcMapInstituteRole.student = 'ECAT_05_Student';
                EcMapInstituteRole.external = 'ECAT_06_External';
                return EcMapInstituteRole;
            })();
            exports_1("EcMapInstituteRole", EcMapInstituteRole);
            EcMapAnimationsEnum = (function () {
                function EcMapAnimationsEnum() {
                }
                EcMapAnimationsEnum.fadeIn = 'fadeIn';
                EcMapAnimationsEnum.fadeInLeft = 'fadeInLeft';
                EcMapAnimationsEnum.fadeInRight = 'fadeInRight';
                EcMapAnimationsEnum.fadeInUp = 'fadeInUp';
                EcMapAnimationsEnum.fadeInDown = 'fadeInDown';
                EcMapAnimationsEnum.bounceIn = 'bounceIn';
                EcMapAnimationsEnum.bounceInLeft = 'bounceInLeft';
                EcMapAnimationsEnum.bounceInRight = 'bounceInRight';
                EcMapAnimationsEnum.bounceInUp = 'bounceInUp';
                EcMapAnimationsEnum.rotateInDownRight = 'rotateInDownRight';
                EcMapAnimationsEnum.rotateIn = 'rotateIn';
                EcMapAnimationsEnum.flipInX = 'flipInX';
                EcMapAnimationsEnum.flipInY = 'flipInY';
                EcMapAnimationsEnum.fadeOut = 'fadeOut';
                EcMapAnimationsEnum.fadeOutLeft = 'fadeOutLeft';
                EcMapAnimationsEnum.fadeOutRight = 'fadeOutRight';
                EcMapAnimationsEnum.fadeOutUp = 'fadeOutUp';
                EcMapAnimationsEnum.fadeOutDown = 'fadeOutDown';
                EcMapAnimationsEnum.bounceOut = 'bounceOut';
                EcMapAnimationsEnum.bounceOutLeft = 'bounceOutLeft';
                EcMapAnimationsEnum.bounceOutRight = 'bounceOutRight';
                EcMapAnimationsEnum.bounceOutUp = 'bounceOutUp';
                EcMapAnimationsEnum.rotateOutUpRight = 'rotateOutUpRight';
                EcMapAnimationsEnum.rotateOut = 'rotateOut';
                EcMapAnimationsEnum.flipOutX = 'flipOutX';
                EcMapAnimationsEnum.flipOutY = 'flipOutY';
                return EcMapAnimationsEnum;
            })();
            exports_1("EcMapAnimationsEnum", EcMapAnimationsEnum);
            EcMapEntityType = (function () {
                function EcMapEntityType() {
                }
                EcMapEntityType.unk = 'Unknown';
                EcMapEntityType.person = 'Person';
                EcMapEntityType.security = 'Security';
                EcMapEntityType.loginTk = 'LoginToken';
                EcMapEntityType.facProfile = 'ProfileFaculty';
                EcMapEntityType.hqStaffProfile = 'ProfileStaff';
                EcMapEntityType.studProfile = 'ProfileStudent';
                EcMapEntityType.externalProfile = 'Profileexternal';
                EcMapEntityType.course = 'Course';
                EcMapEntityType.academy = 'Academy';
                EcMapEntityType.group = 'WorkGroup';
                EcMapEntityType.grpMember = 'CrseStudentInGroup';
                EcMapEntityType.studCrseMember = 'StudentInCourse';
                EcMapEntityType.faccultyCrseMember = 'FacultyInCourse';
                EcMapEntityType.spInstr = 'SpInstrument';
                EcMapEntityType.kcInstr = 'KcInstrument';
                EcMapEntityType.ecInstr = 'Instrument';
                EcMapEntityType.spInventory = 'SpInventory';
                EcMapEntityType.kcResult = 'KcResult';
                EcMapEntityType.spResponse = 'SpResponse';
                EcMapEntityType.spComment = 'SpComment';
                EcMapEntityType.spStrat = 'SpStrat';
                EcMapEntityType.spResult = 'SpResult';
                EcMapEntityType.facSpResponse = 'FacSpResponse';
                EcMapEntityType.facSpComment = 'FacSpComment';
                EcMapEntityType.facStratResponse = 'FacStratResponse';
                return EcMapEntityType;
            })();
            exports_1("EcMapEntityType", EcMapEntityType);
            MpSpComment = (function () {
                function MpSpComment() {
                }
                MpSpComment.pos = 'positive';
                MpSpComment.neg = 'negative';
                MpSpComment.neut = 'neutral';
                return MpSpComment;
            })();
            exports_1("MpSpComment", MpSpComment);
            SweetAlertTypes = (function () {
                function SweetAlertTypes() {
                }
                SweetAlertTypes.success = 'success';
                SweetAlertTypes.warn = 'warning';
                SweetAlertTypes.err = 'error';
                SweetAlertTypes.info = 'info';
                SweetAlertTypes.input = 'input';
                return SweetAlertTypes;
            })();
            exports_1("SweetAlertTypes", SweetAlertTypes);
            MpSpStatus = (function () {
                function MpSpStatus() {
                }
                MpSpStatus.und = 'Udr';
                MpSpStatus.open = 'Open';
                MpSpStatus.underReview = 'Under Review';
                MpSpStatus.published = 'Published';
                MpSpStatus.arch = 'ArchiveE';
                return MpSpStatus;
            })();
            exports_1("MpSpStatus", MpSpStatus);
        }
    }
});
