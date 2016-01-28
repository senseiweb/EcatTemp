import 'breezeSaveError'
import ICommon from "core/service/common"

export default class EcUtilityRepoServices {
    saveInProgress = false;
    areItemsLoaded = {
        userProfile: false,
        userToken: false,
        user: false
    }
    
    constructor(private _c: ICommon) { }

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
        this._c.logger.logError(msg, error, 'Query Result', false);
        return this._c.$q.reject(error);
    }

    saveChanges = (manager: breeze.EntityManager): breeze.promises.IPromise<breeze.SaveResult | angular.IPromise<void>> => {
        //TODO: Add a check for token still valid before change
        if (!manager.hasChanges()) {
            return this._c.$q.reject('Nothing to save!');
        }

        if (this.saveInProgress) {
            return this._c.$q.reject('Sorry, already in a save operation...Please wait');
        }

        this._c.broadcast(this._c.coreCfg.coreEvents.saveChangesEvent, { inflight: true });
        this.saveInProgress = true;
        return manager.saveChanges()
            .then((result: breeze.SaveResult) => {
                this._c.logger.logInfo('Save Results', result, 'Core Saving', false);
                return result;
            })
            .catch(this.saveFailed)
            .finally(() => {
                this.saveInProgress = false;
                this._c.broadcast(this._c.coreCfg.coreEvents.saveChangesEvent, { inflight: false });
            });
    }

    private saveFailed = (error): angular.IPromise<any> => {
        var msg = `[Saved Failed] ${breeze.saveErrorMessageService.getErrorMessage(error)}`;
        this._c.logger.logError(msg, error, 'Save Error', false);
        error.msg = msg;

        return this._c.$q.reject(error);
    }
}

