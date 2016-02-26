import angular = require('angular')
import groups from "faculty/feature/workgroups/groups"
import facultyConfig from "faculty/config/configFacultyApp"
import facDataService from "faculty/service/context"
import viewStatus from "faculty/feature/workgroups/status"
import capStudDetail from "faculty/feature/workgroups/capStudDetail"

export default class EcFacilitatorModule {
    moduleId = 'faculty';
    static load = () => new EcFacilitatorModule();
    constructor() {
        angular.module(this.moduleId, [])
            .config(facultyConfig)
            .service(facDataService.serviceId, facDataService)
            .controller(groups.controllerId, groups)
            .controller(viewStatus.controllerId, viewStatus)
            .controller(capStudDetail.controllerId, capStudDetail);
    }
}
