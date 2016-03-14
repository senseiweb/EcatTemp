import ICommon from "core/common/commonService"
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
            hasChangesPrompt = `You unsaved changes in the following modules ==> ${changes}\n Are you sure you would like to logout? [All changes will be lost]`;
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
            location.replace(location.hostname);
       }

        this.c.swal(alertSettings, afterConfirmClose);
    }

    authorizeMenu(state: angular.ui.IState, checkForCrseAdmin): boolean {
        if (!state) {
            return false;
        }

        if (!state.data || !angular.isArray(state.data.authorized)) {
            return true;
        }

        const authorizedStateRoles = state.data.authorized;
        const user = this.dCtx.user.persona;

        if (!user) {
            return false;
        }

        const hasAuthorizedRole = authorizedStateRoles.some(role => role === user.mpInstituteRole);

        if (!hasAuthorizedRole) {
            return false;
        }

        if (checkForCrseAdmin) {
            return user.faculty && user.faculty.isCourseAdmin;
        }

        return true;
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

