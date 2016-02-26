System.register(['angular'], function(exports_1) {
    var angular;
    var EcStudentModule;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
            }],
        execute: function() {
            //import assessments from 'student/features/assessments/assessments'
            //import addAssess from "core/features/assessView/modals/add"
            //import addComment from "core/features/assessView/modals/comment"
            //import editAssess from "core/features/assessView/modals/edit"
            //import studCfgProvider from "student/provider/studCfgProvider"
            //import studAuth from "student/service/studentRequestAuth"
            //import studConfig from "student/config/cfgStudent"
            EcStudentModule = (function () {
                function EcStudentModule() {
                    this.moduleId = 'app.student';
                    angular.module(this.moduleId, []);
                    //.config(studConfig)
                    //.provider(studCfgProvider.id, studCfgProvider)
                    //.controller(assessments.controllerId, assessments)
                    //.controller(addAssess.controllerId, addAssess)
                    //.controller(addComment.controllerId, addComment)
                    //.controller(editAssess.controllerId, editAssess)
                    //.service(studAuth.serviceId, studAuth);
                }
                EcStudentModule.load = function () { return new EcStudentModule(); };
                return EcStudentModule;
            })();
            exports_1("default", EcStudentModule);
        }
    }
});
