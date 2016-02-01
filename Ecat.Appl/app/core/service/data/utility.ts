import 'breezeSaveError'
import ICommon from "core/service/common"
import IEmFactory from "core/service/data/emFactory"
import IDataCtx from "core/service/data/context"
import * as AppVars from "appVars"

export interface ILocalResource {
    userProfile: boolean;
    userToken: boolean;
    user: boolean;
    [name: string]: boolean;
}

export default class EcUtilityRepoServices {

    protected appVars = AppVars;
    protected logSuccess = this.c.logSuccess(this.loggerId);
    protected logInfo = this.c.logInfo(this.loggerId);
    protected logWarn = this.c.logWarning(this.loggerId);
    protected manager: breeze.EntityManager;
    protected saveInProgress = false;
    protected query: breeze.EntityQuery;

    constructor(protected c: ICommon, protected emf: IEmFactory, protected dCtx: IDataCtx, private loggerId: string, protected endPoint: string, protected entityExtCfgs : Array<ecat.entity.IEntityExtension>) {
        this.query = dCtx.queryer;
        this.getManager(emf);
        dCtx.loadedManagers.push({ module: this.endPoint, mgr: this.manager });
    }
    
    private getManager = (factory: IEmFactory): void => {
        this.manager = factory.getNewManager(this.endPoint, this.entityExtCfgs);
    }

    protected loadManager(apiResources: ecat.IApiResources): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        if (!this.manager.metadataStore.isEmpty()) {
            return this.c.$q.when(true);
        }

        return this.manager.fetchMetadata()
            .then(() => {
                this.registerTypes(apiResources);
            })
            .catch(this.queryFailed);
    }

    protected queryLocal = (resource: string, ordering?: string, predicate?: breeze.Predicate): breeze.Entity | breeze.Entity[]=> {
        return this.query.from(resource)
            .orderBy(ordering)
            .where(predicate)
            .using(this.manager)
            .executeLocally();
    }

    protected queryFailed = (error: any) => {
        const msg = `${this.loggerId} Error querying data: ${error ? (error.message || error.statusText) : 'Unknown Reason'}`;
        this.c.logger.logError(msg, error, 'Query Result', false);
        return this.c.$q.reject(error);
    }

    protected registerTypes = (resourcesToRegister: ecat.IApiResources): void => {
        this.emf.registerResourceTypes(this.manager.metadataStore, resourcesToRegister);
    }

    protected saveChanges = (): breeze.promises.IPromise<breeze.SaveResult | angular.IPromise<void>> => {
        //TODO: Add a check for token still valid before change
        if (!this.manager.hasChanges()) {
            return this.c.$q.reject('Nothing to save!');
        }

        if (this.saveInProgress) {
            return this.c.$q.reject('Sorry, already in a save operation...Please wait');
        }

        this.c.broadcast(this.c.coreCfg.coreEvents.saveChangesEvent, { inflight: true });
        this.saveInProgress = true;
        return this.manager.saveChanges()
            .then((result: breeze.SaveResult) => {
                this.logInfo('Save Results', result, false);
                return result;
            })
            .catch(this.saveFailed)
            .finally(() => {
                this.saveInProgress = false;
                this.c.broadcast(this.c.coreCfg.coreEvents.saveChangesEvent, { inflight: false });
            });
    }

    private saveFailed = (error): angular.IPromise<any> => {
        var msg = `[Saved Failed] ${breeze.saveErrorMessageService.getErrorMessage(error)}`;
        this.c.logger.logError(msg, error, 'Save Error', false);
        error.msg = msg;

        return this.c.$q.reject(error);
    }
}

