import angular = require('angular')
import groups from "facilitator/features/groups/groups"
import facilitatorCfgProvider from 'facilitator/provider/facCfgProvider'
import facilitatorConfig from 'facilitator/config/cfgFac'
import viewStatus from "facilitator/features/groups/modals/status"
import capstoneStudentDetail from "facilitator/features/groups/modals/capstonestudentdetail"

export default class EcFacilitatorModule {
    moduleId = 'facilitator';
    static load = () => new EcFacilitatorModule();
    constructor() {
        angular.module(this.moduleId, [])
            .config(facilitatorConfig)
            .provider(facilitatorCfgProvider.providerId, facilitatorCfgProvider)
            .controller(groups.controllerId, groups)
            .controller(viewStatus.controllerId, viewStatus)
            .controller(capstoneStudentDetail.controllerId, capstoneStudentDetail);
    }
}
