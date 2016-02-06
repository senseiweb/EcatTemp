import ng = require('angular')
import 'ngTable'
import groups from "facilitator/features/groups/groups"
//import addAssess from "student/assessments/modals/add"
//import addComment from "student/assessments/modals/comment"
//import editAssess from "student/assessments/modals/edit"
import facilitatorCfgProvider from 'facilitator/provider/facCfgProvider'
import facilitatorConfig from 'facilitator/config/cfgFac'


export default class EcFacilitatorModule {
    static moduleId = 'facilitator';
    facilitatorModule: angular.IModule;
    constructor() {
        this.facilitatorModule = ng.module(EcFacilitatorModule.moduleId, ['ngTable'])
            .config(facilitatorConfig)
            .provider(facilitatorCfgProvider.providerId, facilitatorCfgProvider)
            .controller(groups.controllerId, groups);
    }
}