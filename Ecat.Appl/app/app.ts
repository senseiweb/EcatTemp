import ng = require('angular')
//Required Modules
import 'animate'
import 'ocLazyLoad'
import 'uiRouter'
import 'loadingBar'
import 'breeze'
import 'breezeNg'
import 'ngMessage'
import 'uiBootstrap'
import 'textNg'
import 'templates'
import IEcatStateProvider from 'core/provider/ecStateProvider'

//Import Module Configuration
import globalStateCfg from 'core/config/coreStateConfig'
import globalMiscCfg from 'core/config/globalCfg'
import coreModCfg from 'core/config/coreModCfg'

//Import Module Controllers
import mainCntrl from 'core/global/main' 
import {EcSideBarCntrl as sidebarCntrl} from 'core/directives/sidebar'
import dashboardCntrl from 'core/userViews/dashboard'
import profileCntrl from 'core/userViews/profile'
import loginCntrl from 'core/global/login'

//Import Module directives
import {EcSidebarDirective as ecSidebar} from 'core/directives/sidebar'
import ecToggleSb from 'core/directives/toggleSidebar'
import ecToggleSub from 'core/directives/toggleSubMenu'
import  * as ecMalihuScrollDirective from 'core/directives/malihuScroll'
import ecFrmCntrl from 'core/directives/frmControl'
import ecFgLine from 'core/directives/fgLine'
import btnWave from 'core/directives/btnWaves'
import tabError from "core/directives/tabError"
import iMask from "core/directives/inputMask"
import compareTo from "core/directives/compareTo"
import emailValidator from "core/directives/userEmailValidator"

//Import Module Services/Factory/Providers
import ecStateProvider from 'core/provider/ecStateProvider'
import ecMalihuScrollService from 'core/service/plugin/malihuScroll'
import ecCoreCfgProvider from 'core/provider/coreModCfgProvider'
import dataCtx from 'core/service/data/context'
import emFactory from 'core/service/data/emFactory'
import userRepo from 'core/service/data/user'
import utilityRepo from 'core/service/data/utility'
import growl from 'core/service/plugin/growl'
import common from 'core/service/common'
import logger from 'core/service/logger'
import dialogService from "core/service/dialog"
import localDs from "core/service/data/local"
import authService from "core/service/requestAuthenicator"

import * as Enum from 'appVars'
import moment from "moment"

export default class AppStart {
    constructor() {
        ng.module('appEcat',
            [
                'ui.router',
                'ui.bootstrap',
                'ngAnimate',
                'ngMessages',
                'angular-loading-bar',
                'oc.lazyLoad',
                'breeze.angular',
                'textAngular',
                'templates'
            ])
            .config(globalStateCfg)
            .config(globalMiscCfg)
            .config(coreModCfg)
            .constant('userStatic', this.setUserStatic())
            .controller(mainCntrl.controllerId, mainCntrl)
            .controller(sidebarCntrl.controllerId, sidebarCntrl)
            .controller(dashboardCntrl.controllerId, dashboardCntrl)
            .controller(profileCntrl.controllerId, profileCntrl)
            .controller(loginCntrl.controllerId, loginCntrl)
            .directive(ecFgLine.directiveId, () => new ecFgLine())
            .directive(ecFrmCntrl.directiveId, () => new ecFrmCntrl())
            .directive(ecSidebar.directiveId, () => new ecSidebar())
            .directive(ecToggleSb.directiveId, () => new ecToggleSb())
            .directive(ecToggleSub.directiveId, () => new ecToggleSub())
            .directive(btnWave.directiveId, () => new btnWave())
            .directive(tabError.directiveId, () => new tabError())
            .directive(compareTo.directiveId, () => new compareTo())
            .directive(iMask.directiveId, () => new iMask)
            .directive(emailValidator.directiveId, ['$q', dataCtx.serivceId, ($q, dataCtx) => new emailValidator($q, dataCtx)])
            .directive(ecMalihuScrollDirective.EcOverFlowNiceScroll.directiveId, [ecMalihuScrollService.serviceId, '$state', IEcatStateProvider.providerId, (nss, $state, stateMgr) => new ecMalihuScrollDirective.EcOverFlowNiceScroll(nss, $state, stateMgr)])
                .provider(ecStateProvider.providerId, ecStateProvider)
                .provider(ecCoreCfgProvider.providerId, ecCoreCfgProvider)
                .service(ecMalihuScrollService.serviceId, ecMalihuScrollService)
                .service(authService.serviceId,authService)
                .service(dataCtx.serivceId, dataCtx)
                .service(emFactory.serviceId, emFactory)
                .service(userRepo.serviceId, userRepo)
                .service(utilityRepo.serviceId, utilityRepo)
                .service(growl.serviceId, growl)
                .service(common.serviceId, common)
                .service(logger.serviceId, logger)
                .service(localDs.serviceId, localDs)
                .service(dialogService.serviceId, dialogService)
                .run(['$rootScope','$state','breeze', this.stateChangeError]);

        this.ngShell = ng;
    }   

    ngShell: angular.IAngularStatic;

    private setUserStatic = (): ecat.entity.ILoginToken => {
        let existingUserToken = window.sessionStorage.getItem('ECAT:TOKEN') || window.localStorage.getItem('ECAT:TOKEN');

        if (!existingUserToken) {
            existingUserToken = angular.element('#user-token').data('user-string'); 
            angular.element('#user-token').removeAttr('data-user-string');

            if (existingUserToken && existingUserToken !== '@ViewBag.User' ) {
                window.sessionStorage.setItem('ECAT:TOKEN', JSON.stringify(existingUserToken));
                return existingUserToken;
            } else {
                return null;
            }
        }

        let loginToken = JSON.parse(existingUserToken) as ecat.entity.ILoginToken;
        const expire = loginToken.tokenExpire as any;

        if (new Date(expire) < new Date()) {
            existingUserToken = angular.element('#user-token').data('usertstring');

            if (existingUserToken && existingUserToken !== '@ViewBag.User') {
                window.sessionStorage.setItem('ECAT:TOKEN', JSON.stringify(existingUserToken));
                loginToken = existingUserToken;
            } else {
                loginToken = null;
            }
        } 

        angular.element('#user-token').removeAttr('data-user-string');

        return loginToken ;
    }

    private stateChangeError = ($rootScope: angular.IRootScopeService, $state: angular.ui.IStateService, ...params: any[]) => {
        $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, routeError) => {
            if (typeof routeError === 'object') {
                const error = routeError as ecat.IRoutingError;
                event.preventDefault();
                switch (error.errorCode) {
                    case Enum.SysErrorType.AuthNoToken:
                    case Enum.SysErrorType.AuthNoUid:
                        console.log(error.message);
                        return $state.go(error.redirectTo, params[0]);
                    default:
                        console.log(error.message);
                }

            } else {
                console.log('Routing Error Occured', routeError);
            }
        });
        
    }
}