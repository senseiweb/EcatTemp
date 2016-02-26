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
    selectedInstrument: ecat.entity.ISpInstrument;

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
        super(inj, 'Designer Data Service', AppVar.EcMapApiResource.designer, []);
        this.loadManager(this.DesignerApiResources);
    }

    //#region New Entities
    getNewInstrument(): ecat.entity.ISpInstrument {
        return this.manager.createEntity(AppVar.EcMapEntityType.spInstr) as ecat.entity.ISpInstrument;
    }

    cloneInstrument(original: ecat.entity.ISpInstrument, newVersion: number): ecat.entity.ISpInstrument {
        const newInstrument = {
            name: original.name,
            version: newVersion,
            isActive: false,
            selfInstructions: original.selfInstructions,
            peerInstructions: original.peerInstructions,
            facilitatorInstructions: original.facilitatorInstructions,
        }

        var cloned = this.manager.createEntity(AppVar.EcMapEntityType.spInstr, newInstrument) as ecat.entity.ISpInstrument;

        original.inventoryCollection.forEach(inv => {
            var newInventory = this.cloneInventory(inv);
            newInventory.instrument = cloned;
            cloned.inventoryCollection.push(newInventory);
        });

        return cloned;
    }

    getNewInventory(instrument: ecat.entity.ISpInstrument): ecat.entity.ISpInventory {
        const newInventory = {
            instrument: instrument
        }

        return this.manager.createEntity(AppVar.EcMapEntityType.spInventory, newInventory) as ecat.entity.ISpInventory;
    }

    cloneInventory(original: ecat.entity.ISpInventory): ecat.entity.ISpInventory {
        const newInventory = {
            instrument: original.instrument,
            isScored: original.isScored,
            isDisplayed: original.isDisplayed,
            behavior: original.behavior
        }

        return this.manager.createEntity(AppVar.EcMapEntityType.spInventory, newInventory) as ecat.entity.ISpInventory;
    }
    //#endregion

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
                return retData.results as ecat.entity.ISpInstrument[];
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
                return retData.results as ecat.entity.ISpInventory[];
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