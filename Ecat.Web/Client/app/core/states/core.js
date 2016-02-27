System.register(["core/common/commonService", "core/service/data/context"], function(exports_1) {
    var commonService_1, context_1;
    var CoreStates;
    return {
        setters:[
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            }],
        execute: function() {
            CoreStates = (function () {
                function CoreStates() {
                    this.parentName = 'core';
                    this.app = {
                        name: 'app',
                        url: '/app',
                        abstract: true,
                        templateUrl: 'Client/app/core/feature/global/global.html',
                        controller: 'app.global as app'
                    };
                    this.main = {
                        name: this.app.name + ".main",
                        parent: this.app.name,
                        url: '/main',
                        templateUrl: 'Client/app/core/feature/global/main.html',
                        controller: 'app.global.main as main',
                        resolve: {
                            tokenValid: [context_1.default.serviceId, commonService_1.default.serviceId, function (dCtx, c) {
                                    return c.checkValidToken();
                                }]
                        }
                    };
                    this.dashboard = {
                        name: this.main.name + ".dashboard",
                        parent: this.main.name,
                        url: '/dashboard',
                        templateUrl: 'Client/app/core/feature/userSystems/dashboard.html',
                        controller: 'app.user.dashboard as dashboard'
                    };
                    this.profile = {
                        name: this.main.name + ".profile",
                        parent: this.main.name,
                        url: '/profile',
                        templateUrl: 'Client/app/core/feature/userSystems/profile.html',
                        controller: 'app.user.profile as profile'
                    };
                    this.redirect = {
                        name: this.app.name + ".redirect",
                        parent: this.app.name,
                        url: '/redirect',
                        abstract: true,
                        template: '<div ui-view></div>'
                    };
                    this.error = {
                        name: this.redirect.name + ".error",
                        parent: this.redirect.name,
                        url: '/error',
                        templateUrl: 'Client/app/core/common/tpls/error.html'
                    };
                    this.login = {
                        name: this.redirect.name + ".login",
                        parent: this.redirect.name,
                        url: '/login/:mode',
                        templateUrl: 'Client/app/core/feature/login/login.html',
                        controller: 'app.global.login as login'
                    };
                    CoreStates.mainRefState = this.main;
                }
                return CoreStates;
            })();
            exports_1("default", CoreStates);
        }
    }
});
