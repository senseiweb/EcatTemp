import IEcStateConfig from 'core/provider/ecStateProvider'
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"
import {SysErrorType as sysErrors} from 'appVars'

export default class EcatGlobalStateConfig
    {
    static $inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider',`${IEcStateConfig.providerId}Provider`,'userStatic'];
        private $state: angular.ui.IStateService;
        private stateMgr: IEcStateConfig;

        constructor( $locProvider?: angular.ILocationProvider,
            $stateProvider?: angular.ui.IStateProvider,
            $urlProvider?: angular.ui.IUrlRouterProvider,
            ecStateCfg?: IEcStateConfig,
            userStatic?: ecat.entity.ILoginToken) {

            if ($stateProvider) {
// ReSharper disable  QualifiedExpressionMaybeNull

                $locProvider.html5Mode(true);
                $urlProvider.otherwise(() => {
                    function calculateUrl(state: angular.ui.IState) {
                        let urlRoute = '';

                        do {
                            urlRoute = state.url + urlRoute;
                            state = state.parent;
                        } while (state !== undefined && state !== null)

                        return urlRoute;
                    }

                    if (userStatic === null) {
                        
                        return  calculateUrl(this.login);
                   }

                    if (userStatic.person.isRegistrationComplete) {
                        return calculateUrl(this.dashboard);
                    }

                    if (!userStatic.person.isRegistrationComplete) {
                        return calculateUrl(this.profile);
                    }

                    return calculateUrl(this.dashboard);

                });
 // ReSharper enable  QualifiedExpressionMaybeNull

                ecStateCfg.global = ({} as any);

                const states = new EcatGlobalStateConfig();
                for (let state in states) {
                    if (states.hasOwnProperty(state) && typeof states[state] === 'object') {
                        ecStateCfg.global[state] = states[state];
                        $stateProvider.state(states[state]);
                    }
                }
            }
        }

        private checkValidToken = (common: ICommon, dataCtx: IDataCtx) => {
            const deferred = common.$q.defer();
            let error: ecat.IRoutingError;

            if (dataCtx.user.token.validatity() === AppVar.TokenStatus.Missing) {

                error = {
                    message: 'Authentication Error: No user token',
                    errorCode: sysErrors.AuthNoUid,
                    redirectTo: this.login,
                    params: { mode: 'login' }
                }

                deferred.reject(error);
                return deferred.promise;
            }

            if (dataCtx.user.token.validatity() === AppVar.TokenStatus.Valid) {
                deferred.resolve();
            } else {
                error = {
                    message: 'Authentication Error: Token Invalid ',
                    errorCode: sysErrors.AuthNoToken,
                    redirectTo: this.login,
                    params: { mode: 'lock' }
                }

                deferred.reject(error);
            }

            return deferred.promise;
        }

        private loadManager = (dataCtx: IDataCtx) => {
            return dataCtx.user.loadManager();
        }

        private appController($rootScope: any, state, stateMgr: IEcStateConfig) {
            $rootScope.$state = state;
            $rootScope.stateMgr = stateMgr;
            //Determining application mobile browswer
            const mobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

            if (mobileBrowser.test(navigator.userAgent)) {
                angular.element('html').addClass('ismobile');
            }
        }

        //#region Global Application States
        app: angular.ui.IState = {
            name: 'app',
            url: '/app',
            abstract: true,
            template:'<div ui-view></div>',
            controllerAs: 'app',
            controller: ['$rootScope', '$state', IEcStateConfig.providerId, this.appController],
            resolve: {
                manager: [IDataCtx.serivceId, this.loadManager]
            }
        }

        main: angular.ui.IState = {
            name: `${this.app.name}.main`,
            parent: this.app,
            url: '/main',
            templateUrl: 'wwwroot/app/core/global/main.html',
            controller: 'app.global.main as main',
            resolve: {
                isLoggedIn: [ICommon.serviceId, IDataCtx.serivceId, 'userStatic', 'manager', this.checkValidToken]
            }
        }

        dashboard: angular.ui.IState = {
            name: `${this.main.name}.dashboard`,
            parent: this.main,
            url: '/dashboard',
            templateUrl: 'wwwroot/app/core/userViews/dashboard.html',
            controller: 'app.user.dashboard as dashboard'
        }

        profile: angular.ui.IState = {
            name: `${this.main.name}.profile`,
            parent: this.main,
            url: '/profile',
            templateUrl: 'wwwroot/app/core/userViews/profile.html',
            controller: 'app.user.profile as profile'
        }

        redirect: angular.ui.IState = {
            name: `${this.app.name}.redirect`,
            parent: this.app,
            url: '/redirect',
            abstract: true,
            template: '<div ui-view></div>',
            resolve: {
                manager: ['manager',(manager) => manager]
            }
        }

        error: angular.ui.IState = {
            name: `${this.redirect.name}.error`,
            parent: this.redirect,
            url: '/error',
            templateUrl: 'wwwroot/app/core/global/tmpls/error.html'
        }

        login: angular.ui.IState = {
            name: `${this.redirect.name}.login`,
            parent: this.redirect,
            url: '/login/:mode',
            templateUrl: 'wwwroot/app/core/global/login.html',
            controller: 'app.global.login as login'
        }

        
            //#endregion

       
    }
    
