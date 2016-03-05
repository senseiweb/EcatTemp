import 'breezeSaveError'
import _common from 'core/common/commonService'
import IEmFactory from "core/service/data/emfactory"
import IDataCtx from 'core/service/data/context'
import * as _mpe from 'core/common/mapEnum'

export interface ILocalResource {
    userProfile: boolean;
    userToken: boolean;
    user: boolean;
    [name: string]: boolean;
}

export default class EcUtilityRepoServices {

    protected apiResources: any;
    protected dCtx: IDataCtx;
    protected c: _common;
    protected emf: IEmFactory;
    protected isLoaded = {} as any;
    protected isActivated = false;
    protected log: {
        error: (msg: string, data: any, showLog: boolean) => void;
        warn: (msg: string, data: any, showLog: boolean) => void;
        info: (msg: string, data: any, showLog: boolean) => void;
        success: (msg: string, data: any, showLog: boolean) => void;
    }
    protected manager: breeze.EntityManager;
    saveInProgress = false;
    protected query: breeze.EntityQuery;

    constructor(inj: angular.auto.IInjectorService,
        private loggerId: string,
        protected endPoint: string,
        protected entityExtCfgs: Array<ecat.entity.ext.IEntityExtension>) {
        const dCtx = inj.get(IDataCtx.serviceId) as IDataCtx;
        const c = inj.get(_common.serviceId) as _common;
        const emf = inj.get(IEmFactory.serviceId) as IEmFactory;
        this.query = new breeze.EntityQuery();
        this.c = c;
        this.log = c.getAllLoggers(this.loggerId);
        this.dCtx = dCtx;
        this.emf = emf;
    }

    addResources(apiResources): void {
        this.apiResources = apiResources;
    }

    protected getManager = (factory: IEmFactory): breeze.promises.IPromise<void> => {
        const _ = this;
        return factory
            .getNewManager(this.endPoint, this.entityExtCfgs)
            .then(getManagerResponse);

        function getManagerResponse(mgr: breeze.EntityManager) {
            _.manager = mgr;
            _.registerTypes(_.apiResources);
            _.dCtx.loadedManagers.push({ module: _.endPoint, mgr: mgr });
            //this.c.$rootScope.$on(this.c.coreCfg.coreApp.events.managerLoaded, (event, data) => {
            //    if (data[0].mgrName === this.endPoint) {
            //        this.mgrReady = true;
            //        this.registerTypes(this.apiResources);
            //    }
            //});
        }
    }


//protected loadManager(apiResources: ecat.IApiResources): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
    //    return this.manager.fetchMetadata()
    //        .then(() => {
    //            this.registerTypes(apiResources);
    //        })
    //        .catch(this.queryFailed);
    //}

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
            errorType: _mpe.QueryError.GeneralServerError
        }
        return this.c.$q.reject(ecatError);
    }

    protected registerTypes = (resourcesToRegister: ecat.IApiResources): void => {
        this.emf.registerResourceTypes(this.manager.metadataStore, resourcesToRegister);
    }

    saveChanges = (): breeze.promises.IPromise<breeze.SaveResult | angular.IPromise<void>> => {
        //TODO: Add a check for token still valid before change
        if (!this.manager.hasChanges()) {
            return this.c.$q.reject('Nothing to save!');
        }

        if (this.saveInProgress) {
            return this.c.$q.reject('Sorry, already in a save operation...Please wait');
        }

        this.c.broadcast(this.c.coreCfg.coreApp.events.saveChangesEvent, { inflight: true });
        this.saveInProgress = true;
        return this.manager.saveChanges()
            .then((result: breeze.SaveResult) => {
                this.log.info('Save Results', result, false);
                return result;
            })
            .catch(this.saveFailed)
            .finally(() => {
                this.saveInProgress = false;
                this.c.broadcast(this.c.coreCfg.coreApp.events.saveChangesEvent, { inflight: false });
            });
    }

    private saveFailed = (error): angular.IPromise<any> => {
        var msg = `[Saved Failed] ${breeze.saveErrorMessageService.getErrorMessage(error)}`;
        this.c.logger.logError(msg, error, 'Save Error', false);
        error.msg = msg;

        return this.c.$q.reject(error);
    }
}

