import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"
import * as AppVar from "appVars"

export default class EcAppCntrl {
    static controllerId = 'app.global';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    mobileBrowserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    constructor(private common: ICommon, private dCtx: IDataCtx) {

        if (this.mobileBrowserAgents.test(navigator.userAgent)) {
            angular.element('html').addClass('ismobile');
        }

        common.$rootScope.$state = common.$state;
        common.$rootScope.stateMgr = common.stateMgr;
    }    

  
}