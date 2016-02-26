import ICommon from "core/common/commonService"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"
import IDataCtx from "core/service/data/context"

export default class EcGlobalLogin {
    static controllerId = 'app.global.login';
    static $inject = ['$scope', '$timeout', ICommon.serviceId, IDataCtx.serviceId];

    badAccount = false;
    gender = _mp.EcMapGender;
    inFlight = false;
    logSucceess = this.c.logSuccess('Login Controller');
    logWarning = this.c.logWarning('Login Controller');
    logError = this.c.logError('Login Controller');
    mode = 'main';
    registrationSuccess = false;
    rememberMe = false;
    user: ecat.entity.IPerson;
    userEmail = '';
    userPassword = '';
    userRegForm: angular.IFormController;

    constructor(private $scope: angular.IScope,
        private $timeout: angular.ITimeoutService,
        private c: ICommon,
        private dCtx: IDataCtx) {

        console.log('Login Controller Loaded');
        this.mode = c.$stateParams.mode;
        const reminder = localStorage.getItem('ECAT:RME');
        this.rememberMe = !!reminder;
        this.user = dCtx.user.persona;
        if (this.rememberMe) {
            this.userEmail = reminder;
        }

        $scope.$on(c.coreCfg.coreApp.events.saveChangesEvent, (data: any) => {
            this.inFlight = data.inflight;
        });
    }

    closeBadAccountAlert(): void { this.badAccount = false; }

    changeState(state: string): any {
        switch (state) {
            case 'register':
                if (this.user) {
                    return null;
                }
                this.dCtx.user.createUserLocal(true).then((user: ecat.entity.IPerson) => {
                    this.user = user;
                });
                this.userEmail = null;
                this.userPassword = null;
                break;
            default:
                this.mode = state;
        }

        this.badAccount = false;
        this.mode = state;
    }

    logMeIn($event: JQueryKeyEventObject): void {
        if ($event && $event.keyCode !== _mpe.Keycode.Enter) {
            return null;
        }

        const self = this;
        this.badAccount = false;
        function logInSuccess(loginUser: ecat.entity.IPerson): void {
            if (loginUser.registrationComplete) {
                self.c.$state.go(self.c.stateMgr.core.dashboard.name);
            } else {
                self.c.$state.go(self.c.stateMgr.core.profile.name);
            }
        }

        function loginError(error): void {
            self.badAccount = true;
            self.logWarning('Could not located an account matching those credentials', error, true);
            self.registrationSuccess = false;
        }

        this.dCtx.user.loginUser(this.userEmail, this.userPassword, this.rememberMe)
            .then(logInSuccess)
            .catch(loginError);

    }

    processRegistration(): void {
        this.dCtx.user.saveChanges()
            .then(() => {
                this.dCtx.user.persona = null;
                this.user = null;
                this.registrationSuccess = true;
                this.mode = 'main';
            })
            .catch((reason) => {
                this.logWarning(reason as string, reason, true);
            });
    }
}