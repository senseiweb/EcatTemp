import ICommon from "core/common/commonService"
import IDataCtx from "core/service/data/context"

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
        common.$rootScope.startUpComplete = true;
    }


}