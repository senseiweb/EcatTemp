import 'breezeSaveError'
import ICommon from "core/service/common"
import IEmFactory from "core/service/data/emFactory"
import * as AppVars from "appVars"

export default class EcUtilityRepoServices {

    appVars = AppVars;
    areItemsLoaded = {
        userProfile: false,
        userToken: false,
        user: false
    }
    c: ICommon;
    emf: IEmFactory;
    saveInProgress = false;
    
    constructor(private inj: angular.auto.IInjectorService) {
        this.c = inj.get(ICommon.serviceId) as ICommon;
        this.emf = inj.get(IEmFactory.serviceId) as IEmFactory;
    }
    
    getManager = (resourceId: AppVars.EcMapApiResource, exts: Array<ecat.entity.IEntityExtension>): breeze.EntityManager => {
        return this.emf.getNewManager(resourceId, exts);
    }

    queryLocal = (manager: breeze.EntityManager, resource: string, ordering?: string, predicate?: breeze.Predicate): breeze.Entity | breeze.Entity[]=> {
        const query = new breeze.EntityQuery();
        return query.from(resource)
            .orderBy(ordering)
            .where(predicate)
            .using(manager)
            .executeLocally();
    }

    queryFailed = (errorPrefix: string, error: any) => {
        const msg = `${errorPrefix} Error querying data: ${error ? (error.message || error.statusText) : 'Unknown Reason'}`;
        this.c.logger.logError(msg, error, 'Query Result', false);
        return this.c.$q.reject(error);
    }

    saveChanges = (manager: breeze.EntityManager): breeze.promises.IPromise<breeze.SaveResult | angular.IPromise<void>> => {
        //TODO: Add a check for token still valid before change
        if (!manager.hasChanges()) {
            return this.c.$q.reject('Nothing to save!');
        }

        if (this.saveInProgress) {
            return this.c.$q.reject('Sorry, already in a save operation...Please wait');
        }

        this.c.broadcast(this.c.coreCfg.coreEvents.saveChangesEvent, { inflight: true });
        this.saveInProgress = true;
        return manager.saveChanges()
            .then((result: breeze.SaveResult) => {
                this.c.logger.logInfo('Save Results', result, 'Core Saving', false);
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

