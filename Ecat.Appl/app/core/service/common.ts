import ILogger from 'core/service/logger'
import ICoreCfg from 'core/provider/coreCfgProvider'
import IDialog from "core/service/dialog"
import swal from "sweetalert"
import * as AppVars from "appVars"
import IStateMgr from "core/provider/stateProvider"
import moment from 'moment'

export default class EcCommon
{
    static serviceId = 'core.common';
    static $inject = ['$q', '$rootScope', '$state', '$stateParams', ILogger.serviceId, ICoreCfg.providerId, IDialog.serviceId, IStateMgr.providerId];

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
    resourceNames: ecat.IAllApiResources = {
        user: {
            endPointName: 'User',
            checkEmail: {
                resourceName: 'CheckUserEmail',
                entityType: AppVars.EcMapEntityType.unk
            },
            regUser: {
                resourceName: 'PreRegister',
                entityType: AppVars.EcMapEntityType.loginTk
            },
            fetch: {
                resourceName: 'Fetch',
                entityType: AppVars.EcMapEntityType.loginTk
            },
            login: {
                resourceName: 'Login',
                entityType: AppVars.EcMapEntityType.person
            }, 
            resetPin: {
                resourceName: 'ResetPin',
                entityType: AppVars.EcMapEntityType.loginTk
            },
            profile: {
                resourceName: 'Profiles',
                entityType: AppVars.EcMapEntityType.unk
            }
        }
    }
    swal = swal;
    tokenEndpoint: string;

    constructor(public $q: angular.IQService,
        public $rootScope: ecat.IEcRootScope,
        public $state: angular.ui.IStateService,
        public $stateParams: ecat.IEcatParams,
        public logger: ILogger,
        public coreCfg: ICoreCfg,
        public dialog: IDialog,
        public stateMgr: IStateMgr ) {

        const environment = window.localStorage.getItem(this.localStorageKeysBak.appServer);
        this.serverEnvironment = environment || `${window.location.protocol}//${window.location.host}`;

        this.appEndpoint = `${this.serverEnvironment}/breeze/`;
        this.tokenEndpoint = `${this.serverEnvironment}/token`;
    }


    broadcast(event: string,...args): void {
        this.$rootScope.$broadcast(event, args);
        
    }

}



