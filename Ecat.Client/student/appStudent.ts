import angular = require('angular')
import 'uiSelect'
import 'flot'
import 'flotPie'
import 'flotResize'
import 'flotTooltip'
import studCtx from "student/service/context"
import modSpTools from "provider/spTools/modSptools"
import assess from "student/feature/assess/assess"
import assessList from "student/feature/assess/list"
import assessResult from "student/feature/assess/result"

export default class EcStudentModule {
    moduleId = 'app.student';
    static load = () => new EcStudentModule();
    constructor() {
        const spToolMod = new modSpTools();

        angular.module(this.moduleId, ['ui.select',spToolMod.moduleId])
            .controller(assessList.controllerId, assessList)
            .controller(assess.controllerId, assess)
            .controller(assessResult.controllerId, assessResult)
            .service(studCtx.serviceId, studCtx);
    }
}