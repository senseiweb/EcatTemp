System.register(['angular', "student/service/context", "provider/spTools/modSptools", "student/feature/assess/main"], function(exports_1) {
    var angular, context_1, modSptools_1, main_1;
    var EcStudentModule;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (modSptools_1_1) {
                modSptools_1 = modSptools_1_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            }],
        execute: function() {
            //import addAssess from "core/features/assessView/modals/add"
            //import addComment from "core/features/assessView/modals/comment"
            //import editAssess from "core/features/assessView/modals/edit"
            //import studCfgProvider from "student/provider/studCfgProvider"
            //import studAuth from "student/service/studentRequestAuth"
            //import studConfig from "student/config/cfgStudent"
            EcStudentModule = (function () {
                function EcStudentModule() {
                    this.moduleId = 'app.student';
                    var spToolMod = new modSptools_1.default();
                    angular.module(this.moduleId, [spToolMod.moduleId])
                        .controller(main_1.default.controllerId, main_1.default)
                        .service(context_1.default.serviceId, context_1.default);
                    //.config(studConfig)
                    //.provider(studCfgProvider.id, studCfgProvider)
                    //.controller(assessments.controllerId, assessments)
                    //.controller(addAssess.controllerId, addAssess)
                    //.controller(addComment.controllerId, addComment)
                    //.controller(editAssess.controllerId, editAssess)
                }
                EcStudentModule.load = function () { return new EcStudentModule(); };
                return EcStudentModule;
            })();
            exports_1("default", EcStudentModule);
        }
    }
});
