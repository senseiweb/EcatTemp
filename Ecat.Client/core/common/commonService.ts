import _logger from 'core/service/logger'
import _cfgProvider from "core/config/cfgProviders"
import {IStateMgr} from "core/config/cfgProviders"
import swal from "sweetalert"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"
import moment from 'moment'
import IDataCtx from "core/service/data/context"

export default class EcatCommonService {
    static serviceId = 'core.service.common';
    static $inject = ['$injector', '$location', '$q', '$rootScope', '$state', '$stateParams', _logger.serviceId, _cfgProvider.appCfgProvider.id, _cfgProvider.stateConfigProvider.id, 'userStatic'];

    appEndpoint: string;

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

    getAllLoggers = (loggerTitle: string) => ({
        succes: () => this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Success),
        error: () => this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Error),
        warn: () => this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Warning),
        info: () => this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Info)
    });

    logSuccess = (controllerId: string) => this.logger.getLogFn(controllerId, _mpe.AlertTypes.Success);
    logError = (controllerId: string) => this.logger.getLogFn(controllerId, _mpe.AlertTypes.Error);
    logWarning = (controllerId: string) => this.logger.getLogFn(controllerId, _mpe.AlertTypes.Warning);
    logInfo = (controllerId: string) => this.logger.getLogFn(controllerId, _mpe.AlertTypes.Info);
    moment = moment;
    private workingRouterError = false;
    swal = swal;
    tokenEndpoint: string;

    constructor(private inj: angular.auto.IInjectorService,
        private $location: angular.ILocationService,
        public $q: angular.IQService,
        public $rootScope: ecat.IEcRootScope,
        public $state: angular.ui.IStateService,
        public $stateParams: ecat.IEcatParams,
        public logger: _logger,
        public coreCfg: ecat.IModuleAppCfg,
        public stateMgr: IStateMgr,
        private userStatic: ecat.entity.ILoginToken) {

        const environment = window.localStorage.getItem(this.localStorageKeysBak.appServer);
        this.serverEnvironment = environment || `${window.location.protocol}//${window.location.host}`;

        this.appEndpoint = `${this.serverEnvironment}/breeze/`;
        this.tokenEndpoint = `${this.serverEnvironment}/ecat-token`;
    }

    appStartup(): void {

        this.$rootScope.$on('$stateChangeStart', ($event: angular.IAngularEvent, to: angular.ui.IState, toParams: any, from: angular.ui.IState, fromParams: any) => {

            const dCtx = this.inj.get('data.context') as IDataCtx;

            if (!to.data || (!angular.isArray(to.data.authorized) && !angular.isDefined(to.data.validateToken))) {
                return true;
            }

            if (angular.isArray(to.data.authorized)) {
                this.checkUserRoles(dCtx.user.persona, to.data.authorized, $event);
            }
        });

        this.$rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, routeError) => {

            if (angular.isObject(routeError)) {

                const error = routeError as ecat.IRoutingError;
                event.preventDefault();

                switch (error.errorCode) {
                    case _mpe.SysErrorType.AuthNoToken:
                    case _mpe.SysErrorType.AuthExpired:
                        const tkError: SweetAlert.Settings = {
                            title: 'Registration Error',
                            text: error.message,
                            type: 'error',
                            closeOnConfirm: true
                        }
                        swal(tkError, () => {
                            this.$state.go(error.redirectTo);
                        }
                        );
                        break;

                    case _mpe.SysErrorType.RegNotComplete:
                        const regError: SweetAlert.Settings = {
                            title: 'Registration Error',
                            text: error.message,
                            type: 'error',
                            closeOnConfirm: true
                        }
                        swal(regError, () => {
                            this.$state.go(error.redirectTo, null, { notify: false });
                        });
                        break;

                    case _mpe.SysErrorType.NotAuthorized:
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

    broadcast(event: string, ...args): void {
        this.$rootScope.$broadcast(event, args);
    }

    checkUserRoles(user: ecat.entity.IPerson, authorizedRoles: Array<_mp.EcMapInstituteRole>, event: angular.IAngularEvent) {
        const deferred = this.$q.defer();

        const userRole = (user) ? user.mpInstituteRole :
            (this.userStatic) ? this.userStatic.person.mpInstituteRole :
                _mp.EcMapInstituteRole.external;

        if (!authorizedRoles.some(role => role === userRole)) {
            event.preventDefault();
            const alertError: ecat.IRoutingError = {
                redirectTo: 'app.main.dashboard',
                errorCode: _mpe.SysErrorType.NotAuthorized,
                message: 'You are attempting to access a resource that requires an authorization level that you current do not have.'
            }
            deferred.reject(alertError);
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    checkValidToken(existDefer?: angular.IDeferred<Object>): angular.IPromise<boolean> | angular.IPromise<void> {

        const deferred = existDefer ? existDefer : this.$q.defer();

        const dCtx = this.inj.get('data.context') as IDataCtx;

        if (!dCtx.user.mgrLoaded) {
            const off = this.$rootScope.$on(this.coreCfg.coreApp.events.managerLoaded, (event, data) => {
                if (data[0].loaded && data[0].mgrName === 'User') {
                    off();
                    dCtx.user.createUserToken();
                    this.checkValidToken(deferred);
                }
            });
            return deferred.promise;
        }

        const tokenStatus = dCtx.user.token.validity();

        if (tokenStatus === _mpe.TokenStatus.Valid) {
            deferred.resolve(true);
            return deferred.promise;
        }

        if (this.workingRouterError) {
            deferred.reject("Working an error");
            return deferred.promise;
        }

        const error: ecat.IRoutingError = {
            errorCode: _mpe.SysErrorType.Undefined,
            redirectTo: '',
            params: {},
            message: ''
        }

        if (tokenStatus === _mpe.TokenStatus.Expired) {
            error.errorCode = _mpe.SysErrorType.AuthExpired;
            error.redirectTo = this.stateMgr.core.login.name;
            error.message = 'You authenication token has expired.';
            error.params = { mode: 'lock' };
            this.workingRouterError = true;
            deferred.reject(error);
        }

        if (tokenStatus === _mpe.TokenStatus.Missing) {
            error.errorCode = _mpe.SysErrorType.AuthNoToken;
            error.redirectTo = this.stateMgr.core.login.name;
            error.message = 'You authenication token was not found. Please login.';
            error.params = { mode: 'login' };
            this.workingRouterError = true;
            deferred.reject(error);
        }

        return deferred.promise;
    }

}







