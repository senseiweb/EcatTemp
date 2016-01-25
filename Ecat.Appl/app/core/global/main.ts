import IStateProvider from 'core/provider/stateProvider'
import IDateCtx from "core/service/data/context"

export default class EcAppMain {
    static controllerId = 'app.global.main';
    static $inject = ['$state', IDateCtx.serivceId, IStateProvider.providerId];

    sidebarToggle = { left: false, right: false };
    user = this.dataCtx.user.persona;

    constructor(
        private $state: angular.ui.IStateService,
        private dataCtx: IDateCtx,
        private stateMgr: IStateProvider) {
    }

    adminAuthorized(): boolean {
        return this.stateMgr.admin.admin.data.isAuthorized(this.user.mpInstituteRole);
    }

    sidebarStat(event: JQueryEventObject): void {
        const isAlreadyActive = angular.element(event.target)
            .parent()
            .hasClass('active');

        if (!isAlreadyActive) {
            this.sidebarToggle.left = false;
        }
    }
}

