import angular = require('angular')
import 'uiSelect'
import 'flot'
import 'flotPie'
import 'flotResize'
import 'flotTooltip'
import modSpTools from "provider/spTools/modSptools"
import facultyConfig from 'faculty/config/configFacultyApp'
import facDataService from 'faculty/service/facCtx'
import adminDataService from "faculty/service/lmsAdminCtx"
import wrkgrpList from 'faculty/feature/workgroups/list'
import wrkgrpAssess from 'faculty/feature/workgroups/assess'
import wrkgrpPublish from 'faculty/feature/workgroups/publish'
import wrkgrpCap from 'faculty/feature/workgroups/capstone'
import wrkgrpResult from 'faculty/feature/workgroups/result'
import crseAdCrses from 'faculty/feature/courseAdmin/courses'
import crseAdGrps from 'faculty/feature/courseAdmin/groups'

export default class EcFacilitatorModule {
    moduleId = 'faculty';
    static load = () => new EcFacilitatorModule();
    constructor() {
        const spToolMod = new modSpTools();
        angular.module(this.moduleId, ['ui.select', spToolMod.moduleId])
            .config(facultyConfig)
            .service(facDataService.serviceId, facDataService)
            .service(adminDataService.serviceId, adminDataService)
            .controller(wrkgrpList.controllerId, wrkgrpList)
            .controller(wrkgrpAssess.controllerId, wrkgrpAssess)
            .controller(wrkgrpPublish.controllerId, wrkgrpPublish)
            .controller(wrkgrpCap.controllerId, wrkgrpCap)
            .controller(wrkgrpResult.controllerId, wrkgrpResult)
            .controller(crseAdCrses.controllerId, crseAdCrses)
            .controller(crseAdGrps.controllerId, crseAdGrps);
    }
}
