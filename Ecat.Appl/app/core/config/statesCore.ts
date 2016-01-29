import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"

export default class EcCoreStates {

    private checkValidToken = (c: ICommon, dCtx: IDataCtx) => {
        const deferred = c.$q.defer();
        let error: ecat.IRoutingError;

        if (dCtx.user.token.validatity() === c.appVar.TokenStatus.Missing) {

            error = {
                message: 'Authentication Error: No user token',
                errorCode: c.appVar.SysErrorType.AuthNoToken,
                redirectTo: this.login.name,
                params: { mode: 'login' }
            }

            deferred.reject(error);
        }

        if (dCtx.user.token.validatity() === c.appVar.TokenStatus.Expired) {
            error = {
                message: 'Authentication Error: Token Invalid ',
                errorCode: c.appVar.SysErrorType.AuthNoToken,
                redirectTo: this.login.name,
                params: { mode: 'lock' }
            }

            deferred.reject(error);
        } else {
            deferred.resolve(true);
        }

        return deferred.promise;
    }

    private loadManager = (dataCtx) => {
        return dataCtx.user.loadManager();
    }

    private appController(c: ICommon) {
        c.$rootScope.$state = c.$state;
        c.$rootScope.stateMgr = c.stateMgr;
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
            controller: [ICommon.serviceId, this.appController],
            resolve: {
                manager: [IDataCtx.serviceId, this.loadManager]
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
                isLoggedIn: [ICommon.serviceId, IDataCtx.serviceId, 'userStatic', 'manager', this.checkValidToken]
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
