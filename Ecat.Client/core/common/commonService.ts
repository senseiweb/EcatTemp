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
        success:  this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Success),
        error: this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Error),
        warn: this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Warning),
        info: this.logger.getLogFn(loggerTitle, _mpe.AlertTypes.Info)
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

    broadcast(event: string, ...args): void {
        this.$rootScope.$broadcast(event, args);
    }

}







