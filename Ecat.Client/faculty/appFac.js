System.register(['angular', "faculty/feature/workgroups/groups", "faculty/config/configFacultyApp", "faculty/service/context", "faculty/feature/workgroups/status", "faculty/feature/workgroups/capStudDetail"], function(exports_1) {
    var angular, groups_1, configFacultyApp_1, context_1, status_1, capStudDetail_1;
    var EcFacilitatorModule;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
            },
            function (groups_1_1) {
                groups_1 = groups_1_1;
            },
            function (configFacultyApp_1_1) {
                configFacultyApp_1 = configFacultyApp_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (status_1_1) {
                status_1 = status_1_1;
            },
            function (capStudDetail_1_1) {
                capStudDetail_1 = capStudDetail_1_1;
            }],
        execute: function() {
            EcFacilitatorModule = (function () {
                function EcFacilitatorModule() {
                    this.moduleId = 'faculty';
                    angular.module(this.moduleId, [])
                        .config(configFacultyApp_1.default)
                        .service(context_1.default.serviceId, context_1.default)
                        .controller(groups_1.default.controllerId, groups_1.default)
                        .controller(status_1.default.controllerId, status_1.default)
                        .controller(capStudDetail_1.default.controllerId, capStudDetail_1.default);
                }
                EcFacilitatorModule.load = function () { return new EcFacilitatorModule(); };
                return EcFacilitatorModule;
            })();
            exports_1("default", EcFacilitatorModule);
        }
    }
});
