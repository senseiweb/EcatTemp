﻿//#region Import Required Modules
import angular = require('angular')
//#endregion 

//#region Import Module Configuration
import stateCfg from "core/config/cfgState"
import coreCfg from 'core/config/cfgCore'
//#endregion

//#region Import Module Controllers
import mainCntrl from 'core/global/main'
import dashboardCntrl from 'core/features/userViews/dashboard'
import profileCntrl from 'core/features/userViews/profile'
import loginCntrl from 'core/global/login'
import appCntrl from "core/global/appGlobal"
//#endregion

//#region Import Module directives
import ecToggleSb from 'core/directives/toggleSidebar'
import ecToggleSub from 'core/directives/toggleSubMenu'
import * as ecMalihuScrollDirective from 'core/directives/malihuScroll'
import ecFrmCntrl from 'core/directives/frmControl'
import ecFgLine from 'core/directives/fgLine'
import btnWave from 'core/directives/btnWaves'
import tabError from 'core/directives/tabError'
import iMask from 'core/directives/inputMask'
import compareTo from 'core/directives/compareTo'
import emailValidator from 'core/directives/userEmailValidator'
//#endregion 

//#region Import Module Services/Factory/Providers
import stateProvider from 'core/provider/stateProvider'
import ecMalihuScrollService from 'core/service/plugin/malihuScroll'
import coreCfgProvider from 'core/provider/coreCfgProvider'
import dataCtx from 'core/service/data/context'
import emFactory from 'core/service/data/emFactory'
import userRepo from 'core/service/data/user'
import studentRepo from 'student/service/studentData'
import adminRepo from "admin/service/adminData"
import growl from 'core/service/plugin/growl'
import logger from 'core/service/logger'
import dialogService from 'core/service/dialog'
import localDs from 'core/service/data/local'
import authService from 'core/service/requestAuthenicator'
import mockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'
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
            .config(stateCfg)
            .config(coreCfg)
            .constant('userStatic', this.setUserStatic())
            //#endregion

            //#region Controllers
            .controller(appCntrl.controllerId, appCntrl)
            .controller(mainCntrl.controllerId, mainCntrl)
            .controller(dashboardCntrl.controllerId, dashboardCntrl)
            .controller(profileCntrl.controllerId, profileCntrl)
            .controller(loginCntrl.controllerId, loginCntrl)
            //#endregion

            //#region Directives
            .directive(ecFgLine.directiveId, () => new ecFgLine())
            .directive(ecFrmCntrl.directiveId, () => new ecFrmCntrl())
            .directive(ecToggleSb.directiveId, () => new ecToggleSb())
            .directive(ecToggleSub.directiveId, () => new ecToggleSub())
            .directive(btnWave.directiveId, () => new btnWave())
            .directive(tabError.directiveId, () => new tabError())
            .directive(compareTo.directiveId, () => new compareTo())
            .directive(iMask.directiveId, () => new iMask)
            .directive(emailValidator.directiveId, ['$q', dataCtx.serviceId, ($q, dataCtx) => new emailValidator($q, dataCtx)])
            .directive(ecMalihuScrollDirective.EcOverFlowMalihuScroll.directiveId, [ecMalihuScrollService.serviceId, '$state', stateProvider.providerId, (nss, $state, stateMgr) => new ecMalihuScrollDirective.EcOverFlowMalihuScroll(nss, $state, stateMgr)])
            //#endregion

            //#region Providers
            .provider(stateProvider.providerId, stateProvider)
            .provider(coreCfgProvider.providerId, coreCfgProvider)
            //#endregion

            //#region Services
            .service(ecMalihuScrollService.serviceId, ecMalihuScrollService)
            .service(authService.serviceId, authService)
            .service(dataCtx.serviceId, dataCtx)
            .service(emFactory.serviceId, emFactory)
            .service(userRepo.serviceId, userRepo)
            .service(adminRepo.serviceId, adminRepo)
            .service(studentRepo.serviceId, studentRepo)
            .service(growl.serviceId, growl)
            .service(logger.serviceId, logger)
            .service(localDs.serviceId, localDs)
            .service(dialogService.serviceId, dialogService)
            .service(mockRepo.serviceId, mockRepo)

        //#endregion

    }

}