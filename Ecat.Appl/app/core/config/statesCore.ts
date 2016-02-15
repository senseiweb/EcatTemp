import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"

export default class EcCoreStates {

    app: angular.ui.IState = {
        name: 'app',
        url: '/app',
        abstract: true,
        templateUrl: 'wwwroot/app/core/global/appGlobal.html',
        controller: 'app.global as app',
    }

    main: angular.ui.IState = {
        name: `${this.app.name}.main`,
        parent: this.app.name,
        url: '/main',
        templateUrl: 'wwwroot/app/core/global/main.html',
        controller: 'app.global.main as main',
        resolve: {
            tokenValid: [IDataCtx.serviceId, ICommon.serviceId, (dCtx: IDataCtx, c: ICommon) =>
                c.checkValidToken()]
        }
    }

    dashboard: angular.ui.IState = {
        name: `${this.main.name}.dashboard`,
        parent: this.main.name,
        url: '/dashboard',
        templateUrl: 'wwwroot/app/core/features/userViews/dashboard.html',
        controller: 'app.user.dashboard as dashboard'
    }

    profile: angular.ui.IState = {
        name: `${this.main.name}.profile`,
        parent: this.main.name,
        url: '/profile',
        templateUrl: 'wwwroot/app/core/features/userViews/profile.html',
        controller: 'app.user.profile as profile'
    }

    redirect: angular.ui.IState = {
        name: `${this.app.name}.redirect`,
        parent: this.app.name,
        url: '/redirect',
        abstract: true,
        template: '<div ui-view></div>'
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
