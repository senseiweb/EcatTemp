import IEcStateConfig from 'core/provider/stateProvider'
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcCoreStates {

    private checkValidToken = ($state: angular.ui.IStateService, common: ICommon, dataCtx: IDataCtx) => {
        const deferred = common.$q.defer();
        let error: ecat.IRoutingError;

        if (dataCtx.user.token.validatity() === AppVar.TokenStatus.Missing) {

            error = {
                message: 'Authentication Error: No user token',
                errorCode: AppVar.SysErrorType.AuthNoToken,
                redirectTo: this.login.name,
                params: { mode: 'login' }
            }

            deferred.reject(error);
            return deferred.promise;
        }

        if (dataCtx.user.token.validatity() === AppVar.TokenStatus.Expired) {
            error = {
                message: 'Authentication Error: Token Invalid ',
                errorCode: AppVar.SysErrorType.AuthNoToken,
                redirectTo: this.login.name,
                params: { mode: 'lock' }
            }

            deferred.reject(error);
            return deferred.promise;
        } 

        //if (!dataCtx.user.persona.isRegistrationComplete) {

        //    if ($state.includes(this.profile.name)) {
        //        deferred.resolve();
        //        return deferred.promise;
        //    }

        //    error = {
        //        message: 'You must complete your profile before using the rest of application.',
        //        errorCode: AppVar.SysErrorType.RegNotComplete,
        //        redirectTo: this.profile.name
        //    }

        //    deferred.reject(error);
        //    return deferred.promise;
        //} 

        deferred.resolve();
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

    get app(): angular.ui.IState {
        return {
            name: 'app',
            url: '/app',
            abstract: true,
            template: '<div ui-view></div>',
            controllerAs: 'app',
            controller: ['$rootScope', '$state', IEcStateConfig.providerId, this.appController],
            resolve: {
                manager: [IDataCtx.serivceId, this.loadManager]
            }
        };
    }

    get main(): angular.ui.IState {
        return {
            name: `${this.app.name}.main`,
            parent: this.app.name,
            url: '/main',
            templateUrl: 'wwwroot/app/core/global/main.html',
            controller: 'app.global.main as main',
            resolve: {
                isLoggedIn: ['$state', ICommon.serviceId, IDataCtx.serivceId, 'userStatic', 'manager', this.checkValidToken]
            }
        };
    }

    get dashboard(): angular.ui.IState {
        return {
            name: `${this.main.name}.dashboard`,
            parent: this.main.name,
            url: '/dashboard',
            templateUrl: 'wwwroot/app/core/userViews/dashboard.html',
            controller: 'app.user.dashboard as dashboard'
        };
    }

    get profile(): angular.ui.IState {
        return {
            name: `${this.main.name}.profile`,
            parent: this.main.name,
            url: '/profile',
            templateUrl: 'wwwroot/app/core/userViews/profile.html',
            controller: 'app.user.profile as profile'
        };
    }

    get redirect(): angular.ui.IState {
        return {
            name: `${this.app.name}.redirect`,
            parent: this.app.name,
            url: '/redirect',
            abstract: true,
            template: '<div ui-view></div>',
            resolve: {
                manager: ['manager', (manager) => manager]
            }
        };
    }

    get error(): angular.ui.IState {
        return {
            name: `${this.redirect.name}.error`,
            parent: this.redirect.name,
            url: '/error',
            templateUrl: 'wwwroot/app/core/global/tmpls/error.html'
        };
    }

    get login(): angular.ui.IState {
        return {
            name: `${this.redirect.name}.login`,
            parent: this.redirect.name,
            url: '/login/:mode',
            templateUrl: 'wwwroot/app/core/global/login.html',
            controller: 'app.global.login as login'
        };
    }

}
