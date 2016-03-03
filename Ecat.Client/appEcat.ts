//#region Import Required Modules

import angular = require('angular')
import swal from 'sweetalert'
import 'animate'
import 'ngFlot'
import 'ngSanitize'
import 'ocLazyLoad'
import 'uiRouter'
import 'loadingBar'
import 'breeze'
import 'breezeNg'
import 'ngMessage'
import 'uiBootstrap'
import 'textNg'
import 'templates'
import _common from "core/common/commonService"
import appCore from 'core/appCore'

//#endregion 
export default class EcApp {
    static load = () => {
        appCore.load();
        return new EcApp();
    }
    test = 'test3';
    constructor() {
    
        //#region Angular Module Declaration & Dependencies
            angular.module('app.ecat', [
                'ui.router',
                'ui.bootstrap',
                'angular-flot',
                'ngAnimate',
                'ngMessages',
                'ngSanitize',
                'angular-loading-bar',
                'oc.lazyLoad',
                'breeze.angular',
                'textAngular',
                'templates',
                'app.core'
            ])
            .service(_common.serviceId, _common)
            .run([_common.serviceId, 'breeze', (common: _common) => common.appStartup()]);
        //#endregion

    }
}