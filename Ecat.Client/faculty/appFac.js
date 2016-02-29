System.register(['angular', "faculty/config/configFacultyApp", "faculty/service/context", "faculty/feature/workgroups/list", "faculty/feature/workgroups/assess", "faculty/feature/workgroups/publish", "faculty/feature/workgroups/capstone", "faculty/feature/workgroups/result"], function(exports_1) {
    var angular, configFacultyApp_1, context_1, list_1, assess_1, publish_1, capstone_1, result_1;
    var EcFacilitatorModule;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
            },
            function (configFacultyApp_1_1) {
                configFacultyApp_1 = configFacultyApp_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (list_1_1) {
                list_1 = list_1_1;
            },
            function (assess_1_1) {
                assess_1 = assess_1_1;
            },
            function (publish_1_1) {
                publish_1 = publish_1_1;
            },
            function (capstone_1_1) {
                capstone_1 = capstone_1_1;
            },
            function (result_1_1) {
                result_1 = result_1_1;
            }],
        execute: function() {
            EcFacilitatorModule = (function () {
                function EcFacilitatorModule() {
                    this.moduleId = 'faculty';
                    angular.module(this.moduleId, [])
                        .config(configFacultyApp_1.default)
                        .service(context_1.default.serviceId, context_1.default)
                        .controller(list_1.default.controllerId, list_1.default)
                        .controller(assess_1.default.controllerId, assess_1.default)
                        .controller(publish_1.default.controllerId, publish_1.default)
                        .controller(capstone_1.default.controllerId, capstone_1.default)
                        .controller(result_1.default.controllerId, result_1.default);
                }
                EcFacilitatorModule.load = function () { return new EcFacilitatorModule(); };
                return EcFacilitatorModule;
            })();
            exports_1("default", EcFacilitatorModule);
        }
    }
});
