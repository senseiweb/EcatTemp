import angular = require('angular')
import groups from "facilitator/features/groups/groups"
import facilitatorCfgProvider from 'facilitator/provider/facCfgProvider'
import facilitatorConfig from 'facilitator/config/cfgFac'
import facDataService from "facilitator/service/facilitatorData"
import scoreService from 'core/service/scoring'
import viewStatus from "facilitator/features/groups/modals/status"
import capstoneStudentDetail from "facilitator/features/groups/modals/capstonestudentdetail"
import assessAdd from "core/features/assessView/modals/add"
import assessEdit from "core/features/assessView/modals/edit"
import commentAe from "core/features/assessView/modals/comment"

export default class EcFacilitatorModule {
    moduleId = 'facilitator';
    static load = () => new EcFacilitatorModule();
    constructor() {
        angular.module(this.moduleId, [])
            .config(facilitatorConfig)
            .provider(facilitatorCfgProvider.providerId, facilitatorCfgProvider)
            .service(facDataService.serviceId, facDataService)
            .service(scoreService.serviceId, scoreService)
            .controller(groups.controllerId, groups)
            .controller(viewStatus.controllerId, viewStatus)
            .controller(capstoneStudentDetail.controllerId, capstoneStudentDetail)
            .controller(assessAdd.controllerId, assessAdd)
            .controller(assessEdit.controllerId, assessEdit)
            .controller(commentAe.controllerId, commentAe);
    }
}
