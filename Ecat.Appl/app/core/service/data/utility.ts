import 'breezeSaveError'
import ICoreModCfg from 'core/provider/coreModCfgProvider'
import ICommon from 'core/service/common'

export default class EcUtilityRepoServices {
    static serviceId = 'data.utility';
    static $inject = ['coreModCfg', ICommon.serviceId];
    private query = new breeze.EntityQuery();
    saveInProgress = false;
    userManager: breeze.EntityManager;
    areItemsLoaded = {
        userProfile: false,
        userToken: false,
        user: false
    }

    constructor(private coreCfg: ICoreModCfg,
            private common: ICommon
    ) { }

    //fetchMetadata(manager: breeze.EntityManager): breeze.promises.IPromise<void> {
    //    //return manager.fetchMetadata().then(() => console.log('got it')).catch(this.queryFailed);
        
    //}

    queryLocal = (manager: breeze.EntityManager, resource: string, ordering?: string, predicate?: breeze.Predicate): breeze.Entity | breeze.Entity[]=> {
        return this.query.from(resource)
            .orderBy(ordering)
            .where(predicate)
            .using(manager)
            .executeLocally();
    }

    queryFailed = (error: any) => {
        const msg = `${this.coreCfg.errorPrefix} Error querying data: ${error ? (error.message || error.statusText) : 'Unknown Reason'}`;
        this.common.logger.logError(msg, error, 'Query Result', false);
        return this.common.$q.reject(error);
    }

    saveChanges = (manager: breeze.EntityManager): breeze.promises.IPromise<breeze.SaveResult | angular.IPromise<void>> => {
        if (!manager.hasChanges()) {
            return this.common.$q.reject('Nothing to save!');
        }

        if (this.saveInProgress) {
            return this.common.$q.reject('Sorry, already in a save operation...Please wait');
        }

        this.common.broadcast({ inflight: true });
        this.saveInProgress = true;
        return manager.saveChanges()
            .then((result: breeze.SaveResult) => {
                this.common.logger.logInfo('Save Results', result, 'Core Saving', false);
                return result;
            })
            .catch(this.saveFailed)
            .finally(() => {
                this.saveInProgress = false;
                this.common.broadcast({ inflight: false });
            });
    }

    private saveFailed = (error): angular.IPromise<any> => {
        var msg = `[Saved Failed] ${breeze.saveErrorMessageService.getErrorMessage(error)}`;
        this.common.logger.logError(msg, error, 'Save Error', false);
        error.msg = msg;

        return this.common.$q.reject(error);
    }
}

