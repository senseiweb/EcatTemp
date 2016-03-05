import angular = require('angular')
import 'uiSelect'
import 'flot'
import 'flotPie'
import 'flotResize'
import 'flotTooltip'
import modSpTools from "provider/spTools/modSptools"
import facultyConfig from 'faculty/config/configFacultyApp'
import facDataService from 'faculty/service/context'
import wrkgrpList from 'faculty/feature/workgroups/list'
import wrkgrpAssess from 'faculty/feature/workgroups/assess'
import wrkgrpPublish from 'faculty/feature/workgroups/publish'
import wrkgrpCap from 'faculty/feature/workgroups/capstone'
import wrkgrpResult from 'faculty/feature/workgroups/result'

export default class EcFacilitatorModule {
    moduleId = 'faculty';
    static load = () => new EcFacilitatorModule();
    constructor() {
        const spToolMod = new modSpTools();
        angular.module(this.moduleId, ['ui.select', spToolMod.moduleId])
            .config(facultyConfig)
            .service(facDataService.serviceId, facDataService)
            .controller(wrkgrpList.controllerId, wrkgrpList)
            .controller(wrkgrpAssess.controllerId, wrkgrpAssess)
            .controller(wrkgrpPublish.controllerId, wrkgrpPublish)
            .controller(wrkgrpCap.controllerId, wrkgrpCap)
            .controller(wrkgrpResult.controllerId, wrkgrpResult);
    }
}
