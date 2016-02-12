import ng = require('angular')
import 'ngTable'
import groups from "facilitator/features/groups/groups"
import facilitatorCfgProvider from 'facilitator/provider/facCfgProvider'
import facilitatorConfig from 'facilitator/config/cfgFac'
import viewStatus from "facilitator/features/groups/modals/status"
import capstoneStudentDetail from "facilitator/features/groups/modals/capstonestudentdetail"



export default class EcFacilitatorModule {
    static moduleId = 'facilitator';
    facilitatorModule: angular.IModule;
    constructor() {
        this.facilitatorModule = ng.module(EcFacilitatorModule.moduleId, ['ngTable'])
            .config(facilitatorConfig)
            .provider(facilitatorCfgProvider.providerId, facilitatorCfgProvider)
            .controller(groups.controllerId, groups)
            .controller(viewStatus.controllerId, viewStatus)
            .controller(capstoneStudentDetail.controllerId, capstoneStudentDetail);
    }
}