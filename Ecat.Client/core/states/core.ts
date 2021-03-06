﻿import _common from "core/common/commonService"
import IDataCtx from "core/service/data/context"

export default class CoreStates implements ecat.IEcatStateClass {
    static mainRefState: angular.ui.IState;
    parentName = 'core';

    constructor() {
        CoreStates.mainRefState = this.main;
    }

    app: angular.ui.IState = {
        name: 'app',
        url: '/app',
        abstract: true,
        templateUrl: '@[appCore]/feature/global/global.html',
        controller: 'app.global as app'
    }

    main: angular.ui.IState = {
        name: `${this.app.name}.main`,
        parent: this.app.name,
        url: '/main',
        templateUrl: '@[appCore]/feature/global/main.html',
        controller: 'app.global.main as main',
        resolve: {
            userMgrActivated: [IDataCtx.serviceId, (dCtx: IDataCtx) => dCtx.user.activate()],
            userProfileLoaded: ['userMgrActivated',IDataCtx.serviceId, (uma, dCtx: IDataCtx) => dCtx.user.getUserProfile()],
            tokenValid: ['userMgrActivated', 'userProfileLoaded', (uma) => uma]
        }
    }

    dashboard: angular.ui.IState = {
        name: `${this.main.name}.dashboard`,
        parent: this.main.name,
        url: '/dashboard',
        data: {
            validateToken: true
        },
        templateUrl: '@[appCore]/feature/userSystems/dashboard.html',
        controller: 'app.user.dashboard as dashboard'
    }

    profile: angular.ui.IState = {
        name: `${this.main.name}.profile`,
        parent: this.main.name,
        url: '/profile',
        data: {
            validateToken: true
        },
        templateUrl: '@[appCore]/feature/userSystems/profile.html',
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
        url: '/error/:redirect',
        templateUrl: '@[appCore]/feature/global/error.html'
    }

    login: angular.ui.IState = {
        name: `${this.redirect.name}.login`,
        parent: this.redirect.name,
        url: '/login/:mode',
        templateUrl: '@[appCore]/feature/login/login.html',
        controller: 'app.global.login as login',
        resolve: {
            loginMgrActivated: [IDataCtx.serviceId, (dCtx: IDataCtx) => dCtx.user.activate()],
        }
    }
}