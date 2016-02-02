import ILogger from 'core/service/logger'
import ICoreCfg from 'core/provider/coreCfgProvider'
import IDialog from "core/service/dialog"
import swal from "sweetalert"
import * as AppVars from "appVars"
import IStateMgr from "core/provider/stateProvider"
import moment from 'moment'
import IDataCtx from "core/service/data/context"

export default class EcCommon
{
    static serviceId = 'core.common';
    static $inject = ['$injector','$q', '$rootScope', '$state', '$stateParams', ILogger.serviceId, ICoreCfg.providerId, IDialog.serviceId, IStateMgr.providerId, 'userStatic'];

    areItemsLoaded = {
        academy: false,
        userToken: false,
        userProfile: false,
        user: false,
    }

    appEndpoint: string;
    appVar = AppVars;
    keycodes =  {
        enter: 13
    }
    serverEnvironment: string;
    private localStorageKeysBak = {
        userId: 'ECAT:UID',
        appServer: 'ECAT:APPSERVER',
        clientProfile: `ECAT:CLIENTPROFILE:${this.localStorageUid}`
    };
    get localStorageKeys(): ecat.ILocalStorageKeys { return this.localStorageKeysBak; };
    get localStorageUid(): string {
        return localStorage.getItem((this.localStorageKeys) ? this.localStorageKeys.userId : 'unknown');
    };
    logSuccess = (controllerId: string) => this.logger.getLogFn(controllerId, AppVars.EcMapAlertType.success);
    logError = (controllerId: string) => this.logger.getLogFn(controllerId, AppVars.EcMapAlertType.danger);
    logWarning = (controllerId: string) => this.logger.getLogFn(controllerId, AppVars.EcMapAlertType.warning);
    logInfo = (controllerId: string) => this.logger.getLogFn(controllerId, AppVars.EcMapAlertType.info);
    moment = moment;
    private workingRouterError = false;
    swal = swal;
    tokenEndpoint: string;

    constructor(private inj: angular.auto.IInjectorService,
        public $q: angular.IQService,
        public $rootScope: ecat.IEcRootScope,
        public $state: angular.ui.IStateService,
        public $stateParams: ecat.IEcatParams,
        public logger: ILogger,
        public coreCfg: ICoreCfg,
        public dialog: IDialog,
        public stateMgr: IStateMgr,
        private userStatic: any) {

        const environment = window.localStorage.getItem(this.localStorageKeysBak.appServer);
        this.serverEnvironment = environment || `${window.location.protocol}//${window.location.host}`;

        this.appEndpoint = `${this.serverEnvironment}/breeze/`;
        this.tokenEndpoint = `${this.serverEnvironment}/token`;
    }

    appStartup(): void {

        this.$rootScope.$on('$stateChangeSuccess', ($event: angular.IAngularEvent, to: angular.ui.IState, toParams: any, from: angular.ui.IState, fromParams: any) => {

            const dCtx = this.inj.get('data.context') as IDataCtx;

            if (!to.data || (!angular.isArray(to.data.authorized) && !angular.isDefined(to.data.validateToken))) {
                return true;
            }

            //this.checkValidToken(dCtx.user.token.validity(), $event);

            if (angular.isArray(to.data.authorized)) {
                this.checkUserRoles(dCtx.user.persona, to.data.authorized, $event);
            }
        });

        this.$rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, routeError) => {

            if (angular.isObject(routeError)) {

                const error = routeError as ecat.IRoutingError;
                event.preventDefault();

                switch (error.errorCode) {
                case AppVars.SysErrorType.AuthNoToken:
                case AppVars.SysErrorType.AuthExpired:
                        const tkError: SweetAlert.Settings = {
                            title: 'Registration Error',
                            text: error.message,
                            type: 'error',
                            closeOnConfirm: true
                        }
                    swal(tkError, () => {
                            this.$state.go(error.redirectTo)

                        }
                    );
                    break;

                case AppVars.SysErrorType.RegNotComplete:
                    const regError: SweetAlert.Settings = {
                        title: 'Registration Error',
                        text: error.message,
                        type: 'error',
                        closeOnConfirm: true
                    }
                    swal(regError, () => {
                        this.$state.go(error.redirectTo, null, {notify: false});
                    });
                    break;

                case AppVars.SysErrorType.NotAuthorized:
                    const alertSetting: SweetAlert.Settings = {
                        title: 'Authorization Error',
                        text: error.message,
                        type: 'error',
                        closeOnConfirm: true
                    }
                    swal(alertSetting, () => {
                        this.$state.go(error.redirectTo);
                    });
                    break;

                default:
                    console.log(error.message);
                }

            } else {
                console.log('Routing Error Occured', routeError);
            }
        });
    }

    broadcast(event: string,...args): void {
        this.$rootScope.$broadcast(event, args);
    }

    checkUserRoles(user: ecat.entity.IPerson, authorizedRoles: Array<AppVars.EcMapInstituteRole>, event: angular.IAngularEvent) {

        const userRole = user ? user.mpInstituteRole : this.appVar.EcMapInstituteRole.external;

        if (!authorizedRoles.some(role => role === userRole)) {
            event.preventDefault();
            const alertSetting: SweetAlert.Settings = {
                title: 'Unauthorized Access Attempted',
                text: 'You are attempting to access a resource that requires an authorization level that you current do not have.',
                allowEscapeKey: true,
                closeOnConfirm: true
            }
            this.swal(alertSetting, () => this.$state.go(this.stateMgr.core.dashboard, null, {notify: false}));
        }
    }

    checkValidToken(existDefer?: angular.IDeferred<Object>): angular.IPromise<boolean> | angular.IPromise<void> {

        const deferred = existDefer ? existDefer : this.$q.defer();

        const dCtx = this.inj.get('data.context') as IDataCtx;

        if (!dCtx.user.mgrLoaded) {
            const off = this.$rootScope.$on(this.coreCfg.coreEvents.managerLoaded, (event, data) => {
                if (data[0].loaded && data[0].mgrName === 'User') {
                    off();
                    dCtx.user.createUserToken();
                    this.checkValidToken(deferred);
                }
            });
            return deferred.promise;
        }

        const tokenStatus = dCtx.user.token.validity();

        if (tokenStatus === AppVars.TokenStatus.Valid) {
            deferred.resolve(true);
            return deferred.promise;
        }

        if (this.workingRouterError) {
            deferred.reject("Working an error");
            return deferred.promise;
        }

        const error: ecat.IRoutingError = {
            errorCode: AppVars.SysErrorType.Undefined,
            redirectTo: '',
            params: {},
            message: ''
        }

        if (tokenStatus === AppVars.TokenStatus.Expired) {
            error.errorCode = AppVars.SysErrorType.AuthExpired;
            error.redirectTo = this.stateMgr.core.login;
            error.message = 'You authenication token has expired.';
            error.params = { mode: 'lock' };
            this.workingRouterError = true;
            deferred.reject(error);
        }

        if (tokenStatus === AppVars.TokenStatus.Missing) {
            error.errorCode = AppVars.SysErrorType.AuthNoToken;
            error.redirectTo = this.stateMgr.core.login;
            error.message = 'You authenication token was not found. Please login.';
            error.params = { mode: 'login' };
            this.workingRouterError = true;
            deferred.reject(error);
        }

        return deferred.promise;
    }

}







