import IStateMgr from 'core/provider/ecStateProvider'
import IDateCtx from "core/service/data/context"

export default class EcAppMain {
    static controllerId = 'app.global.main';
    static $inject = ['$state',IDateCtx.serivceId, IStateMgr.providerId];
    user: ecat.entity.IPerson;

    constructor(
        private $state: angular.ui.IStateService,
        private dataCtx: IDateCtx,
        private stateMgr: IStateMgr
        
    ) {
        this.user = dataCtx.user.persona;
    }
    sidebarToggle = { left: false, right: false };

    sidebarStat(event: JQueryEventObject): void {
        const isAlreadyActive = angular.element(event.target)
            .parent()
            .hasClass('active');

        if (!isAlreadyActive) {
            this.sidebarToggle.left = false;
        }
    }
}

