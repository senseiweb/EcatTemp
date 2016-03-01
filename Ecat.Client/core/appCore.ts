//#region Import Required Modules
import 'angular'
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
//#endregion 

//#region Import Module Services/Factory/Providers
import cfgProvider from "core/config/cfgProviders"
import ecMalihuScrollService from 'core/service/plugin/malihuScroll'
import dataCtx from 'core/service/data/context'
import emFactory from "core/service/data/emfactory"
import userRepo from 'core/service/data/user'
import studentRepo from 'student/service/context'
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

    constructor() {

        //#region Angular Module Declaration & Dependencies
        angular.module(EcAppCore.moduleId, [])
            //#endregion

            //#region Configuration
            .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', `${cfgProvider.stateConfigProvider.id}Provider`, 'userStatic',(a,b,c,d,e) => new stateCfg(a,b,c,d,e)])
            .config(['$httpProvider', '$ocLazyLoadProvider', `${cfgProvider.appCfgProvider.id}Provider`, '$provide',(a,b,c,d) => new coreCfg(a,b,c,d)])
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
            .service(emFactory.serviceId, emFactory)
            .service(userRepo.serviceId, userRepo)
            .service(studentRepo.serviceId, studentRepo)
            .service(growl.serviceId, growl)
            .service(logger.serviceId, logger)
            .service(staticDs.serviceId, staticDs);

        //#endregion

    }

}