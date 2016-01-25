import {EcMapEntityType as et} from 'appVars'
import ILogger from 'core/service/logger'
import ICoreCfg from 'core/provider/coreCfgProvider'

export default class EcCommon
{
    static serviceId = 'core.common';
    static $inject = ['$q', '$rootScope', ILogger.serviceId, ICoreCfg.providerId];
    serverEnvironment: string;
    appEndpoint: string;
    keycodes= {
       enter: 13     
    }

    private _localStorageKeys = {
        userId: 'ECAT:UID',
        appServer: 'ECAT:APPSERVER',
        clientProfile: `ECAT:CLIENTPROFILE:${this.localStorageUid}`
    };

    get localStorageKeys(): ecat.ILocalStorageKeys { return this._localStorageKeys; };

    get localStorageUid(): string {
        return localStorage.getItem((this.localStorageKeys) ? this.localStorageKeys.userId : 'unknown');
    };

    resourceNames: ecat.IAllApiResources = {
        user: {
            endPointName: 'User',
            checkEmail: {
                resourceName: 'CheckUserEmail',
                entityType: et.unk
            },
            regUser: {
                resourceName: 'PreRegister',
                entityType: et.loginTk
            },
            fetch: {
                resourceName: 'Fetch',
                entityType: et.loginTk
            },
            login: {
                resourceName: 'Login',
                entityType: et.person
            }, 
            resetPin: {
                resourceName: 'ResetPin',
                entityType: et.loginTk
            },
            profile: {
                resourceName: 'Profiles',
                entityType: et.unk
            }
        }
    }
    tokenEndpoint: string;

    constructor(public $q: angular.IQService,
                public $rootScope: angular.IRootScopeService,
                public logger: ILogger,
                public coreCfg: ICoreCfg) {

        const environment = window.localStorage.getItem(this._localStorageKeys.appServer);
        this.serverEnvironment = environment || `${window.location.protocol}//${window.location.host}`;

        this.appEndpoint = `${this.serverEnvironment}/breeze/`;
        this.tokenEndpoint = `${this.serverEnvironment}/token`;
    }


    broadcast(...args): void {
        this.$rootScope.$broadcast.apply(this.$rootScope, args);
        
    }

}



