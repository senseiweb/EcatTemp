System.register(["core/common/commonService", 'core/service/data/context'], function(exports_1) {
    var commonService_1, context_1;
    var EcAppMain;
    return {
        setters:[
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            }],
        execute: function() {
            EcAppMain = (function () {
                function EcAppMain(c, dCtx) {
                    this.c = c;
                    this.dCtx = dCtx;
                    this.sidebarToggle = { left: false, right: false };
                    this.user = dCtx.user.persona;
                }
                EcAppMain.prototype.logout = function () {
                    var self = this;
                    var hasChangesPrompt;
                    var changes = this.dCtx.unsavedChanges()
                        .map(function (changeObj) { return (" " + changeObj.name); })
                        .toString();
                    if (changes) {
                        hasChangesPrompt = "You unsaved changees in the following modules ==> " + changes + "\n Are you sure you would like to logout? [All changes will be lost]";
                    }
                    var standardPrompt = 'Are you sure you would like to logout?';
                    var alertSettings = {
                        title: 'Confirmation',
                        text: hasChangesPrompt || standardPrompt,
                        type: 'warning',
                        confirmButtonText: 'Logout',
                        closeOnConfirm: true,
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        showCancelButton: true
                    };
                    function afterConfirmClose(confirmed) {
                        if (!confirmed) {
                            return;
                        }
                        self.dCtx.logoutUser();
                        self.c.$state.go(self.c.stateMgr.core.login.name, { mode: 'logout' });
                    }
                    this.c.swal(alertSettings, afterConfirmClose);
                };
                EcAppMain.prototype.authorizeMenu = function (state, checkForCrseAdmin) {
                    if (!state) {
                        return false;
                    }
                    if (!state.data || !angular.isArray(state.data.authorized)) {
                        return true;
                    }
                    var authorizedStateRoles = state.data.authorized;
                    var user = this.dCtx.user.persona;
                    if (!user) {
                        return false;
                    }
                    var hasAuthorizedRole = authorizedStateRoles.some(function (role) { return role === user.mpInstituteRole; });
                    if (!hasAuthorizedRole) {
                        return false;
                    }
                    if (checkForCrseAdmin) {
                        return user.faculty && user.faculty.isCourseAdmin;
                    }
                    return true;
                };
                EcAppMain.prototype.sidebarStat = function (event) {
                    var isAlreadyActive = angular.element(event.target)
                        .parent()
                        .hasClass('active');
                    if (!isAlreadyActive) {
                        this.sidebarToggle.left = false;
                    }
                };
                EcAppMain.controllerId = 'app.global.main';
                EcAppMain.$inject = [commonService_1.default.serviceId, context_1.default.serviceId];
                return EcAppMain;
            })();
            exports_1("default", EcAppMain);
        }
    }
});
