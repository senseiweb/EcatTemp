import angular = require('angular')
import assessments from 'student/features/assessments/assessments'
import addAssess from "student/features/assessments/modals/add"
import addComment from "student/features/assessments/modals/comment"
import editAssess from "student/features/assessments/modals/edit"
import studCfgProvider from "student/provider/studCfgProvider"
import studAuth from "student/service/studentRequestAuth" 
import studConfig from "student/config/cfgStudent"

export default class EcStudentModule {
    moduleId = 'app.student';
    static load = () => new EcStudentModule();
    constructor() {
        angular.module(this.moduleId, [])
            .config(studConfig)
            .provider(studCfgProvider.providerId, studCfgProvider)
            .controller(assessments.controllerId, assessments)
            .controller(addAssess.controllerId, addAssess)
            .controller(addComment.controllerId, addComment)
            .controller(editAssess.controllerId, editAssess)
            .service(studAuth.serviceId, studAuth);
    }
}