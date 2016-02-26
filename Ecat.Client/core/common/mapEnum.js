System.register([], function(exports_1) {
    var SysErrorType, AppNames;
    return {
        setters:[],
        execute: function() {
            (function (SysErrorType) {
                SysErrorType[SysErrorType["Undefined"] = 0] = "Undefined";
                SysErrorType[SysErrorType["AuthNoToken"] = 1] = "AuthNoToken";
                SysErrorType[SysErrorType["AuthExpired"] = 2] = "AuthExpired";
                SysErrorType[SysErrorType["NotAuthorized"] = 3] = "NotAuthorized";
                SysErrorType[SysErrorType["RegNotComplete"] = 4] = "RegNotComplete";
                SysErrorType[SysErrorType["MetadataFailure"] = 5] = "MetadataFailure";
            })(SysErrorType || (SysErrorType = {}));
            exports_1("SysErrorType", SysErrorType);
            (function (AppNames) {
                AppNames[AppNames["Core"] = 0] = "Core";
                AppNames[AppNames["Admin"] = 1] = "Admin";
                AppNames[AppNames["Instructor"] = 2] = "Instructor";
                AppNames[AppNames["Student"] = 3] = "Student";
            })(AppNames || (AppNames = {}));
            exports_1("AppNames", AppNames);
        }
    }
});
