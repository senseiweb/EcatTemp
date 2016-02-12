import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'

interface DesignerApiResources extends ecat.IApiResources {
    getInstruments: ecat.IApiResource,
    getInventories: ecat.IApiResource;
}

export default class EcDesignerRepo extends IUtilityRepo {
    static serviceId = 'data.designer';
    static $inject = ['$injector'];

    activated = false;
    selectedInstrument: ecat.entity.IInstrument;

    private DesignerApiResources: DesignerApiResources = {
        getInstruments: {
            returnedEntityType: this.c.appVar.EcMapEntityType.ecInstr,
            resource: {
                name: 'GetInstruments',
                isLoaded: false
            }
        },
        getInventories: {
            returnedEntityType: this.c.appVar.EcMapEntityType.ecInventory,
            resource: {
                name: 'GetInventories',
                isLoaded: false
            }
        }
    };

    constructor(inj) {
        super(inj, 'Course Admin Data Service', AppVar.EcMapApiResource.courseAdmin, []);
        this.loadManager(this.DesignerApiResources);
    }

    getInstruments(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.DesignerApiResources.getInstruments.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getCoursesResponse)
            .catch(this.queryFailed);

        function getCoursesResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got instruments', retData.results, false);
                self.DesignerApiResources.getInstruments.resource.isLoaded = true;
                return retData.results as ecat.entity.IInstrument[];
            }
        }
    }

    getInventories(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.DesignerApiResources.getInventories.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getGroupResponse)
            .catch(this.queryFailed);

        function getGroupResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got inventories', retData.results, false);
                self.DesignerApiResources.getInventories.resource.isLoaded = true;
                return retData.results as ecat.entity.IInventory[];
            }
        }
    }

    loadCourseAdminManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.DesignerApiResources)
            .then(() => {
                this.registerTypes(this.DesignerApiResources);
            })
            .catch(this.queryFailed);
    }
}