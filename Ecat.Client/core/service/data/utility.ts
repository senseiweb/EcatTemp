import 'breezeSaveError'
import _common from 'core/common/commonService'
import IEmFactory from "core/service/data/emfactory"
import IDataCtx from 'core/service/data/context'
import * as _mpe from 'core/common/mapEnum'
import * as _mp from 'core/common/mapStrings'

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

    protected getManager = (factory: IEmFactory): breeze.promises.IPromise<any | angular.IPromise<void>> => {
        const that = this;
        return factory
            .getNewManager(this.endPoint, this.entityExtCfgs)
            .then(getManagerResponse)
            .catch(this.queryFailed);

        function getManagerResponse(mgr: breeze.EntityManager) {
           that.manager = mgr;
           that.registerTypes(that.apiResources);
           that.dCtx.loadedManagers.push({ module: that.endPoint, mgr: mgr });
        }
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
            errorType: _mpe.QueryError.GeneralServerError
        }
        return this.c.$q.reject(ecatError);
    }

    protected registerTypes = (resourcesToRegister: ecat.IApiResources): void => {
        this.emf.registerResourceTypes(this.manager.metadataStore, resourcesToRegister);
    }

    saveChanges = (entities?: Array<breeze.Entity>): breeze.promises.IPromise<breeze.SaveResult | angular.IPromise<void>> => {
        //TODO: Add a check for token still valid before change
        if (!this.manager.hasChanges()) {
            return this.c.$q.reject('Nothing to save!');
        }

        if (this.saveInProgress) {
            return this.c.$q.reject('Sorry, already in a save operation...Please wait');
        }

        this.c.broadcast(this.c.coreCfg.coreApp.events.saveChangesEvent, { inflight: true });
        this.saveInProgress = true;
        console.log(this.manager.getChanges());
        return this.manager.saveChanges(entities)
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

        if (error.entityErrors) this.processEntityErrors(error.entityErrors);

        return this.c.$q.reject(error);
    }

    private processEntityErrors = (entityErrs: Array<breeze.EntityError>): void => {
        const monitorErrors = entityErrs.filter(err => err.errorName === _mp.MpEntityError.crseNotOpen || err.errorName === _mp.MpEntityError.wgNotOpen);

        if (monitorErrors.length > 0) {
            monitorErrors.forEach(err => {
                err.entity.entityAspect.rejectChanges();
            });
            if (monitorErrors.some(err => err.errorName === _mp.MpEntityError.crseNotOpen)) this.log.error('Your changes have been rejected, the course changed to a published status!', monitorErrors, true);
            if (monitorErrors.some(err => err.errorName === _mp.MpEntityError.wgNotOpen)) this.log.error('Your chagnes have been rejected, the workgroup is no longer opened for changes.', monitorErrors, true);
        }


    }
}

