import angular = require('angular')
import 'uiSelect'
import 'flot'
import 'flotPie'
import 'flotResize'
import 'flotTooltip'
import studCtx from "student/service/context"
import modSpTools from "provider/spTools/modSptools"
import assessMaain from "student/feature/assess/main"


export default class EcStudentModule {
    moduleId = 'app.student';
    static load = () => new EcStudentModule();
    constructor() {
        const spToolMod = new modSpTools();

        angular.module(this.moduleId, ['ui.select',spToolMod.moduleId])
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