//#region Import Required Modules
import 'angular'
import * as _mpe from "core/common/mapEnum"
import swal from "sweetalert"
import {IStateMgr} from "core/config/cfgProviders"
//#endregion 

//#region Import Module Configuration
import stateCfg from 'core/config/cfgAppStates'
import coreCfg from 'core/config/cfgCore'
//#endregion

//#region Import Module Controllers
import mainCntrl from "core/feature/global/main"
import dashboardCntrl from "core/feature/userSystems/dashboard"
import profileCntrl from "core/feature/userSystems/profile"
import loginCntrl from "core/feature/login/login"
import appCntrl from "core/feature/global/global"
import appErrCntrl from "core/feature/global/error"
//#endregion

//#region Import Module directives
import ecToggleSb from 'core/directive/toggleSidebar'
import ecToggleSub from 'core/directive/toggleSubMenu'
import * as ecMalihuScrollDirective from 'core/directive/malihuScroll'
import ecFrmCntrl from 'core/directive/frmControl'
import ecFgLine from 'core/directive/fgLine'
import btnWave from "core/directive/btnWave"
import iMask from 'core/directive/inputMask'
import compareTo from "core/directive/compareToValidator"
import emailValidator from "core/directive/dupEmailvalidator"
import spBoChart from "core/directive/spBreakoutChart"
//#endregion 

//#region Import Module Services/Factory/Providers
import cfgProvider from "core/config/cfgProviders"
import ecMalihuScrollService from 'core/service/plugin/malihuScroll'
import dataCtx from 'core/service/data/context'
import emfactory from "core/service/data/emfactory"
import userRepo from 'core/service/data/user'
import growl from "core/service/plugin/growlNotify"
import logger from 'core/service/logger'
import staticDs from "core/service/data/static"
import authService from "core/service/authenicator"
import * as _mp from "core/common/mapStrings"
//#endregion

export default class EcAppCore {
    static moduleId = 'app.core';
    static load = () => new EcAppCore();
    private setUserStatic = (): ecat.entity.ILoginToken => {

        if (angular.element('#user-token').data('error-string') !== '' && angular.element('#user-token').data('error-string') !== '@ViewBag.Error') {
            let promptSettings: SweetAlert.Settings = {
                title: 'Login Error!',
                text: angular.element('#user-token').data('error-string'),
                type: 'error',
                showConfirmButton: true,
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Close Window"
            }
            swal(promptSettings, function () { window.close(); });
            return null;
        }

        let existingUserToken = window.sessionStorage.getItem('ECAT:TOKEN') || window.localStorage.getItem('ECAT:TOKEN');

        if (!existingUserToken) {
            existingUserToken = angular.element('#user-token').data('user-string');
            angular.element('#user-token').removeAttr('data-user-string');

            if (existingUserToken && existingUserToken !== '@ViewBag.User') {
                window.sessionStorage.setItem('ECAT:TOKEN', JSON.stringify(existingUserToken));
                return existingUserToken;
            } else {
                return null;
            }
        }

        let loginToken = JSON.parse(existingUserToken) as ecat.entity.ILoginToken;
        const expire = loginToken.tokenExpire as any;

        if (new Date(expire) < new Date()) {
            const newToken = angular.element('#user-token').data('usertstring');

            if (newToken && newToken !== '@ViewBag.User') {
                window.sessionStorage.setItem('ECAT:TOKEN', JSON.stringify(newToken));
            } else {
                window.sessionStorage.removeItem('ECAT:TOKEN');
                window.localStorage.removeItem('ECAT:TOKEN');
            }

            loginToken = newToken || loginToken;
        }

        angular.element('#user-token').removeAttr('data-user-string');

        return loginToken;
    }
    private wireUpListeners = ($q: angular.IQService, $rs: angular.IRootScopeService, $state: angular.ui.IStateService, dCtx: dataCtx, stateMgr: IStateMgr, userStatic: ecat.entity.ILoginToken): void => {
        
        
        function notifyError(error: ecat.IRoutingError) {
            const promptSettings: SweetAlert.Settings = {
                title: 'System Navigation Error',
                text: error.message,
                type: 'error',
                closeOnConfirm: true
            }
            swal(promptSettings);
        }

        $rs.$on('$stateChangeStart', ($event: angular.IAngularEvent, to: angular.ui.IState, toParams: any, from: angular.ui.IState, fromParams: any) => {

            if (!to.data) {
                return null;
            }

            const error: ecat.IRoutingError = {
                errorCode: _mpe.SysErrorType.Undefined,
                redirectTo: '',
                params: {},
                message: ''
            }

            if (angular.isDefined(to.data.validateToken)) {
              
                const tokenStatus = dCtx.user.token.validity();

                if (tokenStatus === _mpe.TokenStatus.Expired) {
                    error.errorCode = _mpe.SysErrorType.AuthExpired;
                    error.redirectTo = stateMgr.core.login.name;
                    error.message = 'Your authentication token has expired. Please re-login.';
                    notifyError(error);
                    $event.preventDefault();
                    return $state.go(stateMgr.core.login.name, { mode: 'lock', redirect: to, params: toParams });
                }

                if (tokenStatus === _mpe.TokenStatus.Missing) {
                    error.errorCode = _mpe.SysErrorType.AuthNoToken;
                    error.redirectTo = stateMgr.core.login.name;
                    error.message = 'Your authentication token was not found. Please login.';
                    error.params = { mode: 'login' };
                    notifyError(error);
                    $event.preventDefault();
                    return $state.go(stateMgr.core.login.name, { mode: 'login', redirect: to, params: toParams });
                }
               
            }

            if (angular.isArray(to.data.authorized)) {
                const user = dCtx.user.persona;
                const userRole = user ? user.mpInstituteRole : userStatic.person.mpInstituteRole;
                error.errorCode = _mpe.SysErrorType.NotAuthorized;
                error.redirectTo = stateMgr.core.login.name;
                error.message = 'You are attempting to access a resource that requires an authorization level that is not currently associated with your account.';

                if (!userRole) {
                    notifyError(error);
                    $event.preventDefault();
                }
                const authorizedRoles = to.data.authorized as Array<string>;

                if (!authorizedRoles.some(authRole => authRole === userRole)) {
                    notifyError(error);
                    $event.preventDefault();
                }
            }
            return true;
        });

        $rs.$on('$stateChangeError', ($event, toState, toParams, fromState, fromParams, routeError) => {

            if (angular.isObject(routeError)) {

                const error = routeError as ecat.IRoutingError;
                $event.preventDefault();

                switch (error.errorCode) {
                case _mpe.SysErrorType.RegNotComplete:
                    const regError: SweetAlert.Settings = {
                        title: 'Registration Error',
                        text: error.message,
                        type: 'error',
                        closeOnConfirm: true
                    }
                    swal(regError, () => {
                        $state.go(error.redirectTo, {}, { notify: false });
                    });
                    break;

                default:
                    const promptSettings: SweetAlert.Settings = {
                        title: 'Unexpected Navigation Error',
                        text: 'A unexpected system navigation error occurred. Please retry your request, or contact support if the problem persist',
                        type: 'error',
                        closeOnConfirm: true
                    }
                    swal(promptSettings,() => {
                        $state.go(stateMgr.core.error.name, { redirect: fromState.url });
                    });
                    console.log(error.message);
                }
            }
        });
    }

    constructor() {

        //#region Angular Module Declaration & Dependencies
        angular.module(EcAppCore.moduleId, [])
            //#endregion

            //#region Configuration
            .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', `${cfgProvider.stateConfigProvider.id}Provider`, 'userStatic', (a, b, c, d, e) => new stateCfg(a, b, c, d, e)])
            .config(['$httpProvider', '$ocLazyLoadProvider', `${cfgProvider.appCfgProvider.id}Provider`, '$provide', (a, b, c, d) => new coreCfg(a, b, c, d)])
            .constant('userStatic', this.setUserStatic())
            //#endregion

            //#region Controllers
            .controller(appCntrl.controllerId, appCntrl)
            .controller(mainCntrl.controllerId, mainCntrl)
            .controller(dashboardCntrl.controllerId, dashboardCntrl)
            .controller(profileCntrl.controllerId, profileCntrl)
            .controller(loginCntrl.controllerId, loginCntrl)
            .controller(appErrCntrl.controllerId, appErrCntrl)
            //#endregion

            //#region Directives
            .directive(ecFgLine.directiveId, () => new ecFgLine())
            .directive(ecFrmCntrl.directiveId, () => new ecFrmCntrl())
            .directive(ecToggleSb.directiveId, () => new ecToggleSb())
            .directive(ecToggleSub.directiveId, () => new ecToggleSub())
            .directive(btnWave.directiveId, () => new btnWave())
            .directive(compareTo.directiveId, () => new compareTo())
            .directive(spBoChart.directiveId, () => new spBoChart())
            .directive(iMask.directiveId, () => new iMask)
            .directive(emailValidator.directiveId, ['$q', dataCtx.serviceId, ($q, dataCtx) => new emailValidator($q, dataCtx)])
            .directive(ecMalihuScrollDirective.EcOverFlowMalihuScroll.directiveId, [ecMalihuScrollService.serviceId, '$state', cfgProvider.stateConfigProvider.id, (nss, $state, stateMgr) => new ecMalihuScrollDirective.EcOverFlowMalihuScroll(nss, $state, stateMgr)])
            //#endregion

            //#region Providers
            .provider(cfgProvider.appCfgProvider.id, cfgProvider.appCfgProvider.provider)
            .provider(cfgProvider.stateConfigProvider.id, cfgProvider.stateConfigProvider.provider())
            //#endregion

            //#region Services
            .service(ecMalihuScrollService.serviceId, ecMalihuScrollService)
            .service(authService.serviceId, authService)
            .service(dataCtx.serviceId, dataCtx)
            .service(emfactory.serviceId, emfactory)
            .service(userRepo.serviceId, userRepo)
            .service(growl.serviceId, growl)
            .service(logger.serviceId, logger)
            .service(staticDs.serviceId, staticDs)
            .run(['$q', '$rootScope', '$state', dataCtx.serviceId, cfgProvider.stateConfigProvider.id,'userStatic', this.wireUpListeners]);

        //#endregion

    }

}