import ng = require('angular')
import 'ngTable'
import assessments from 'student/assessments/assessments'
import addComment from "student/assessments/modals/comment"
import studCfgProvider from "student/provider/studCfgProvider"
import studAuth from "student/service/studentRequestAuth"
import studConfig from "student/config/cfgStudent"

export default class EcStudentModule {
    static moduleId = 'student';
    studentModule: angular.IModule;
    constructor() {
        this.studentModule = ng.module(EcStudentModule.moduleId, ['ngTable'])
            .config(studConfig)
            .provider(studCfgProvider.providerId, studCfgProvider)
            .controller(assessments.controllerId, assessments)
            .controller(addComment.controllerId, addComment)
            .service(studAuth.serviceId, studAuth);
    }
}