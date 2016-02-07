//#region Import Required Modules
import angular = require('angular')
import swal from "sweetalert"
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
import common from "core/service/common"
import appCore from "core/core"

//#endregion 
export default class EcApp {
    static load = () => {
        appCore.load();
        return new EcApp();
    }

    constructor() {

       //#region Angular Module Declaration & Dependencies
        angular
            .module('app.ecat', [
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
            .service(common.serviceId, common)
            .run([common.serviceId, 'breeze', (common: common) => common.appStartup()]);
        //#endregion

    }   
}