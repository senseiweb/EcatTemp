//#region Import Required Modules

import angular = require('angular')
import swal from 'sweetalert'
import 'animate'
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
            .run(['breeze', (breeze) => {
                Array.prototype.getUnique = function () {
                    const u = {};
                    const a = [];
                    for (var i = 0, l = this.length; i < l; ++i) {
                        if (u.hasOwnProperty(this[i])) {
                            continue;
                        }
                        a.push(this[i]);
                        u[this[i]] = 1;
                    }
                    return a;
                } 
                }]);
        //#endregion

    }
}