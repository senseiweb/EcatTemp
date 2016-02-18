import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context'

export default class EcAppMain {
    static controllerId = 'app.global.main';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    sidebarToggle = { left: false, right: false };
    user: ecat.entity.IPerson;
    constructor(private c: ICommon, private dCtx: IDataCtx) {
        this.user = dCtx.user.persona;
    }

    logout(): void {
        const self = this;
        let hasChangesPrompt: string;
        const changes = this.dCtx.unsavedChanges()
            .map((changeObj) => ` ${changeObj.name}`)
            .toString();

        if (changes) {
            hasChangesPrompt = `You unsaved changees in the following modules ==> ${changes}\n Are you sure you would like to logout? [All changes will be lost]`;
        }

        const standardPrompt = 'Are you sure you would like to logout?';
        const alertSettings: SweetAlert.Settings = {
            title: 'Confirmation',
            text: hasChangesPrompt || standardPrompt,
            type: 'warning',
            confirmButtonText: 'Logout',
            closeOnConfirm: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
            showCancelButton: true
        }

        function afterConfirmClose(confirmed: boolean) {
            if (!confirmed) {
                return;
            }
            self.dCtx.logoutUser();
            self.c.$state.go(self.c.stateMgr.core.login.name, { mode: 'logout' });
        }

        this.c.swal(alertSettings, afterConfirmClose);
    }

    authorizeMenu(state: angular.ui.IState): boolean {
        if (!state) {
          return false;
        }

        if (!state.data || !state.data.authorized) {
            return true;
        }
        const authorizedStateRoles = state.data.authorized;
        const user = this.dCtx.user.persona;
        return user && angular.isArray(authorizedStateRoles) && authorizedStateRoles.some(role => role === user.mpInstituteRole);
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

