//#region Import Required Modules
System.register(['angular', 'animate', 'ocLazyLoad', 'uiRouter', 'loadingBar', 'breeze', 'breezeNg', 'ngMessage', 'uiBootstrap', 'textNg', 'templates', "core/common/commonService", 'core/appCore'], function(exports_1) {
    var angular, commonService_1, appCore_1;
    var EcApp;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (_4) {},
            function (_5) {},
            function (_6) {},
            function (_7) {},
            function (_8) {},
            function (_9) {},
            function (_10) {},
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (appCore_1_1) {
                appCore_1 = appCore_1_1;
            }],
        execute: function() {
            //#endregion 
            EcApp = (function () {
                function EcApp() {
                    //#region Angular Module Declaration & Dependencies
                    angular.module('app.ecat', [
                        'ui.router',
                        'ui.bootstrap',
                        'ngAnimate',
                        'ngMessages',
                        'angular-loading-bar',
                        'oc.lazyLoad',
                        'breeze.angular',
                        'textAngular',
                        'templates',
                        'app.core'
                    ])
                        .service(commonService_1.default.serviceId, commonService_1.default)
                        .run([commonService_1.default.serviceId, 'breeze', function (common) { return common.appStartup(); }]);
                    //#endregion
                }
                EcApp.load = function () {
                    appCore_1.default.load();
                    return new EcApp();
                };
                return EcApp;
            })();
            exports_1("default", EcApp);
        }
    }
});
