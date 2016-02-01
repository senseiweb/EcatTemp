import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"

export default class EcCoreStates {

    private loadUserManager = (dataCtx: IDataCtx, common: ICommon) => {
        return dataCtx.user.loadUserManager().then((isLoaded: boolean) =>
            common.checkValidToken(dataCtx.user.token.validity(), isLoaded)
        );
    }

    app: angular.ui.IState = {
        name: 'app',
        url: '/app',
        abstract: true,
        templateUrl: 'wwwroot/app/core/global/appGlobal.html',
        controller: 'app.global as app',
        resolve: {
            userManager: [IDataCtx.serviceId,ICommon.serviceId,this.loadUserManager]
        }
    }

    main: angular.ui.IState = {
        name: `${this.app.name}.main`,
        parent: this.app.name,
        url: '/main',
        templateUrl: 'wwwroot/app/core/global/main.html',
        controller: 'app.global.main as main',
        resolve: {
            userManager: ['userManager', (userManager) => userManager]
        },
        data: {
            validateToken: true
        }
    }

    dashboard: angular.ui.IState = {
        name: `${this.main.name}.dashboard`,
        parent: this.main.name,
        url: '/dashboard',
        templateUrl: 'wwwroot/app/core/userViews/dashboard.html',
        controller: 'app.user.dashboard as dashboard',
        resolve: {
            userManager: ['userManager', (userManager) => userManager]
        }
    }

    profile: angular.ui.IState = {
        name: `${this.main.name}.profile`,
        parent: this.main.name,
        url: '/profile',
        templateUrl: 'wwwroot/app/core/userViews/profile.html',
        controller: 'app.user.profile as profile',
        resolve: {
            userManager: ['userManager', (userManager) => userManager]
        }
    }

    redirect: angular.ui.IState = {
        name: `${this.app.name}.redirect`,
        parent: this.app.name,
        url: '/redirect',
        abstract: true,
        template: '<div ui-view></div>',
        resolve: {
            userManager: ['userManager', (userManager) => userManager]
        }
    }

    error: angular.ui.IState = {
        name: `${this.redirect.name}.error`,
        parent: this.redirect.name,
        url: '/error',
        templateUrl: 'wwwroot/app/core/global/tmpls/error.html'
    }

    login: angular.ui.IState = {
        name: `${this.redirect.name}.login`,
        parent: this.redirect.name,
        url: '/login/:mode',
        templateUrl: 'wwwroot/app/core/global/login.html',
        controller: 'app.global.login as login'
    }

}
