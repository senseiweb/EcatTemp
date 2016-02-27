import angular = require('angular')
import studCtx from "student/service/context"
import modSpTools from "provider/spTools/modSptools"
import assessMaain from "student/feature/assess/main"

//import addAssess from "core/features/assessView/modals/add"
//import addComment from "core/features/assessView/modals/comment"
//import editAssess from "core/features/assessView/modals/edit"
//import studCfgProvider from "student/provider/studCfgProvider"
//import studAuth from "student/service/studentRequestAuth"
//import studConfig from "student/config/cfgStudent"

export default class EcStudentModule {
    moduleId = 'app.student';
    static load = () => new EcStudentModule();
    constructor() {
        const spToolMod = new modSpTools();

        angular.module(this.moduleId, [spToolMod.moduleId])
            .controller(assessMaain.controllerId, assessMaain)
            .service(studCtx.serviceId, studCtx);
            //.config(studConfig)
            //.provider(studCfgProvider.id, studCfgProvider)
            //.controller(assessments.controllerId, assessments)
            //.controller(addAssess.controllerId, addAssess)
            //.controller(addComment.controllerId, addComment)
            //.controller(editAssess.controllerId, editAssess)
    }
}