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
    protected apiResources: any;
    protected dCtx: IDataCtx;
    protected c: ICommon;
    protected emf: IEmFactory;
    protected logSuccess: (msg: string, data: any, showLog: boolean) => void;
    protected logInfo: (msg: string, data: any, showLog: boolean) => void;
    protected logWarn: (msg: string, data: any, showLog: boolean) => void;
    protected manager: breeze.EntityManager;
    mgrLoaded = false;
    protected saveInProgress = false;
    protected query: breeze.EntityQuery;

    constructor(inj: angular.auto.IInjectorService,
        private loggerId: string,
        protected endPoint: string,
        protected entityExtCfgs: Array<ecat.entity.IEntityExtension>) {

        const dCtx = inj.get(IDataCtx.serviceId) as IDataCtx;
        const c = inj.get(ICommon.serviceId) as ICommon;
        const emf = inj.get(IEmFactory.serviceId) as IEmFactory;
        this.query = new breeze.EntityQuery();
        this.c = c;
        this.dCtx = dCtx;
        this.emf = emf;
        this.mgrLoaded = false;
        this.logSuccess = this.c.logSuccess(this.loggerId);
        this.logInfo = this.c.logInfo(this.loggerId);
        this.logWarn = this.c.logWarning(this.loggerId);
        this.getManager(emf);
    }
    
    addResources(apiResources): void {
        this.apiResources = apiResources;
    }

    private getManager = (factory: IEmFactory): void => {

        this.manager = factory.getNewManager(this.endPoint, this.entityExtCfgs);

        this.c.broadcast(this.c.coreCfg.coreEvents.addManager, { data: { module: this.endPoint, mgr: this.manager } });

        this.c.$rootScope.$on(this.c.coreCfg.coreEvents.managerLoaded, (event, data) => {
            if (data[0].mgrName === this.endPoint) {
                this.mgrLoaded = true;
                this.registerTypes(this.apiResources);
            }
        });
    }

    protected loadManager(apiResources: ecat.IApiResources): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
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
        var ecatError: ecat.IQueryError = {
            errorMessage: msg,
            errorType: this.c.appVar.QueryError.GeneralServerError
        }
        return this.c.$q.reject(ecatError);
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

