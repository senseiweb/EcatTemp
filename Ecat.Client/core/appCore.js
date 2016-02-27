System.register(['angular', 'core/config/cfgAppStates', 'core/config/cfgCore', "core/feature/global/main", "core/feature/userSystems/dashboard", "core/feature/userSystems/profile", "core/feature/login/login", "core/feature/global/global", 'core/directive/toggleSidebar', 'core/directive/toggleSubMenu', 'core/directive/malihuScroll', 'core/directive/frmControl', 'core/directive/fgLine', "core/directive/btnWave", 'core/directive/inputMask', "core/directive/compareToValidator", "core/directive/dupEmailvalidator", "core/config/cfgProviders", 'core/service/plugin/malihuScroll', 'core/service/data/context', "core/service/data/emfactory", 'core/service/data/user', 'student/service/context', "core/service/plugin/growlNotify", 'core/service/logger', "core/service/data/static", "core/service/authenicator"], function(exports_1) {
    var cfgAppStates_1, cfgCore_1, main_1, dashboard_1, profile_1, login_1, global_1, toggleSidebar_1, toggleSubMenu_1, ecMalihuScrollDirective, frmControl_1, fgLine_1, btnWave_1, inputMask_1, compareToValidator_1, dupEmailvalidator_1, cfgProviders_1, malihuScroll_1, context_1, emfactory_1, user_1, context_2, growlNotify_1, logger_1, static_1, authenicator_1;
    var EcAppCore;
    return {
        setters:[
            function (_1) {},
            function (cfgAppStates_1_1) {
                cfgAppStates_1 = cfgAppStates_1_1;
            },
            function (cfgCore_1_1) {
                cfgCore_1 = cfgCore_1_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            },
            function (dashboard_1_1) {
                dashboard_1 = dashboard_1_1;
            },
            function (profile_1_1) {
                profile_1 = profile_1_1;
            },
            function (login_1_1) {
                login_1 = login_1_1;
            },
            function (global_1_1) {
                global_1 = global_1_1;
            },
            function (toggleSidebar_1_1) {
                toggleSidebar_1 = toggleSidebar_1_1;
            },
            function (toggleSubMenu_1_1) {
                toggleSubMenu_1 = toggleSubMenu_1_1;
            },
            function (ecMalihuScrollDirective_1) {
                ecMalihuScrollDirective = ecMalihuScrollDirective_1;
            },
            function (frmControl_1_1) {
                frmControl_1 = frmControl_1_1;
            },
            function (fgLine_1_1) {
                fgLine_1 = fgLine_1_1;
            },
            function (btnWave_1_1) {
                btnWave_1 = btnWave_1_1;
            },
            function (inputMask_1_1) {
                inputMask_1 = inputMask_1_1;
            },
            function (compareToValidator_1_1) {
                compareToValidator_1 = compareToValidator_1_1;
            },
            function (dupEmailvalidator_1_1) {
                dupEmailvalidator_1 = dupEmailvalidator_1_1;
            },
            function (cfgProviders_1_1) {
                cfgProviders_1 = cfgProviders_1_1;
            },
            function (malihuScroll_1_1) {
                malihuScroll_1 = malihuScroll_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (emfactory_1_1) {
                emfactory_1 = emfactory_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (growlNotify_1_1) {
                growlNotify_1 = growlNotify_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (static_1_1) {
                static_1 = static_1_1;
            },
            function (authenicator_1_1) {
                authenicator_1 = authenicator_1_1;
            }],
        execute: function() {
            //#endregion
            EcAppCore = (function () {
                function EcAppCore() {
                    this.setUserStatic = function () {
                        var existingUserToken = window.sessionStorage.getItem('ECAT:TOKEN') || window.localStorage.getItem('ECAT:TOKEN');
                        if (!existingUserToken) {
                            existingUserToken = angular.element('#user-token').data('user-string');
                            angular.element('#user-token').removeAttr('data-user-string');
                            if (existingUserToken && existingUserToken !== '@ViewBag.User') {
                                window.sessionStorage.setItem('ECAT:TOKEN', JSON.stringify(existingUserToken));
                                return existingUserToken;
                            }
                            else {
                                return null;
                            }
                        }
                        var loginToken = JSON.parse(existingUserToken);
                        var expire = loginToken.tokenExpire;
                        if (new Date(expire) < new Date()) {
                            var newToken = angular.element('#user-token').data('usertstring');
                            if (newToken && newToken !== '@ViewBag.User') {
                                window.sessionStorage.setItem('ECAT:TOKEN', JSON.stringify(newToken));
                            }
                            else {
                                window.sessionStorage.removeItem('ECAT:TOKEN');
                                window.localStorage.removeItem('ECAT:TOKEN');
                            }
                            loginToken = newToken || loginToken;
                        }
                        angular.element('#user-token').removeAttr('data-user-string');
                        return loginToken;
                    };
                    //#region Angular Module Declaration & Dependencies
                    angular.module(EcAppCore.moduleId, [])
                        .config(cfgAppStates_1.default)
                        .config(cfgCore_1.default)
                        .constant('userStatic', this.setUserStatic())
                        .controller(global_1.default.controllerId, global_1.default)
                        .controller(main_1.default.controllerId, main_1.default)
                        .controller(dashboard_1.default.controllerId, dashboard_1.default)
                        .controller(profile_1.default.controllerId, profile_1.default)
                        .controller(login_1.default.controllerId, login_1.default)
                        .directive(fgLine_1.default.directiveId, function () { return new fgLine_1.default(); })
                        .directive(frmControl_1.default.directiveId, function () { return new frmControl_1.default(); })
                        .directive(toggleSidebar_1.default.directiveId, function () { return new toggleSidebar_1.default(); })
                        .directive(toggleSubMenu_1.default.directiveId, function () { return new toggleSubMenu_1.default(); })
                        .directive(btnWave_1.default.directiveId, function () { return new btnWave_1.default(); })
                        .directive(compareToValidator_1.default.directiveId, function () { return new compareToValidator_1.default(); })
                        .directive(inputMask_1.default.directiveId, function () { return new inputMask_1.default; })
                        .directive(dupEmailvalidator_1.default.directiveId, ['$q', context_1.default.serviceId, function ($q, dataCtx) { return new dupEmailvalidator_1.default($q, dataCtx); }])
                        .directive(ecMalihuScrollDirective.EcOverFlowMalihuScroll.directiveId, [malihuScroll_1.default.serviceId, '$state', cfgProviders_1.default.stateConfigProvider.id, function (nss, $state, stateMgr) { return new ecMalihuScrollDirective.EcOverFlowMalihuScroll(nss, $state, stateMgr); }])
                        .provider(cfgProviders_1.default.appCfgProvider.id, cfgProviders_1.default.appCfgProvider.provider)
                        .provider(cfgProviders_1.default.stateConfigProvider.id, cfgProviders_1.default.stateConfigProvider.provider())
                        .service(malihuScroll_1.default.serviceId, malihuScroll_1.default)
                        .service(authenicator_1.default.serviceId, authenicator_1.default)
                        .service(context_1.default.serviceId, context_1.default)
                        .service(emfactory_1.default.serviceId, emfactory_1.default)
                        .service(user_1.default.serviceId, user_1.default)
                        .service(context_2.default.serviceId, context_2.default)
                        .service(growlNotify_1.default.serviceId, growlNotify_1.default)
                        .service(logger_1.default.serviceId, logger_1.default)
                        .service(static_1.default.serviceId, static_1.default);
                    //#endregion
                }
                EcAppCore.moduleId = 'app.core';
                EcAppCore.load = function () { return new EcAppCore(); };
                return EcAppCore;
            })();
            exports_1("default", EcAppCore);
        }
    }
});
