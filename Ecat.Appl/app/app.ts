import ng = require('angular')
import swal from "sweetalert"
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

//Import Module Configuration
import stateCfg from 'core/config/cfgState'
import coreCfg from 'core/config/cfgCore'

//Import Module Controllers
import mainCntrl from 'core/global/main' 
import dashboardCntrl from 'core/userViews/dashboard'
import profileCntrl from 'core/userViews/profile'
import loginCntrl from 'core/global/login'
import adminAcademy from "admin/academy/academy"

//Import Module directives
import ecToggleSb from 'core/directives/toggleSidebar'
import ecToggleSub from 'core/directives/toggleSubMenu'
import  * as ecMalihuScrollDirective from 'core/directives/malihuScroll'
import ecFrmCntrl from 'core/directives/frmControl'
import ecFgLine from 'core/directives/fgLine'
import btnWave from 'core/directives/btnWaves'
import tabError from 'core/directives/tabError'
import iMask from 'core/directives/inputMask'
import compareTo from 'core/directives/compareTo'
import emailValidator from 'core/directives/userEmailValidator'

//Import Module Services/Factory/Providers
import stateProvider from 'core/provider/stateProvider'
import ecMalihuScrollService from 'core/service/plugin/malihuScroll'
import coreCfgProvider from 'core/provider/coreCfgProvider'
import dataCtx from 'core/service/data/context'
import emFactory from 'core/service/data/emFactory'
import userRepo from 'core/service/data/user'
import growl from 'core/service/plugin/growl'
import common from "core/service/common"
import logger from 'core/service/logger'
import dialogService from 'core/service/dialog'
import localDs from 'core/service/data/local'
import authService from 'core/service/requestAuthenicator'

import * as Enum from 'appVars'
import moment from 'moment'

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
            .config(stateCfg)
            .config(coreCfg)
            .constant('userStatic', this.setUserStatic())
            .controller(mainCntrl.controllerId, mainCntrl)
            .controller(dashboardCntrl.controllerId, dashboardCntrl)
            .controller(profileCntrl.controllerId, profileCntrl)
            .controller(loginCntrl.controllerId, loginCntrl)
            .controller(adminAcademy.controllerId, adminAcademy)
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
            .provider(stateProvider.providerId, stateProvider)
            .provider(coreCfgProvider.providerId, coreCfgProvider)
            .service(ecMalihuScrollService.serviceId, ecMalihuScrollService)
            .service(authService.serviceId,authService)
            .service(dataCtx.serviceId, dataCtx)
            .service(emFactory.serviceId, emFactory)
            .service(userRepo.serviceId, userRepo)
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
                loginToken = existingUserToken ? existingUserToken : null;
            }
        } 

        angular.element('#user-token').removeAttr('data-user-string');

        return loginToken ;
    }

    private stateChangeError = ($rootScope: angular.IRootScopeService, $state: angular.ui.IStateService, dialog:dialogService, ...params: any[]) => {
        $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, routeError) => {

            if (typeof routeError === 'object') {

                const error = routeError as ecat.IRoutingError;
                event.preventDefault();

                switch (error.errorCode) {
                    case Enum.SysErrorType.AuthNoToken:
                    case Enum.SysErrorType.AuthExpired:
                        console.log(error.message);
                        return $state.go(error.redirectTo, params[0]);

                    case Enum.SysErrorType.RegNotComplete:
                        const regError: SweetAlert.Settings = {
                            title: 'Registration Error',
                            text: error.message,
                            type: 'error',
                            closeOnConfirm: true
                        }
                        swal(regError, () => {
                            $state.go(error.redirectTo);
                        });

                    case Enum.SysErrorType.NotAuthorized:
                        const alertSetting: SweetAlert.Settings = {
                            title: 'Authorization Error',
                            text: error.message,
                            type: 'error',
                            closeOnConfirm: true
                        }
                        swal(alertSetting, () => {
                            $state.go(error.redirectTo);
                        });

                    default:
                        console.log(error.message);
                }

            } else {
                console.log('Routing Error Occured', routeError);
            }
        });
        
    }
}