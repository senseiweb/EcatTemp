import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"

export default class EcGlobalLogin {
    static controllerId = 'app.global.login';
    static $inject = ['$scope','$timeout', ICommon.serviceId, IDataCtx.serviceId];

    badAccount = false;
    gender = this.c.appVar.EcMapGender;
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

        if (this.rememberMe) {
            this.userEmail = reminder;
        }

        $scope.$on(c.coreCfg.coreEvents.saveChangesEvent, (data: any) => {
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
            const user = this.dCtx.user.createUserLocal(true);
            this.user = user;
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
        if ($event && $event.keyCode !== this.c.appVar.Keycode.Enter) {
            return null;
        }

        const self = this;
        this.badAccount = false;
        function logInSuccess(loginUser: ecat.entity.IPerson): void {
            if (loginUser.isRegistrationComplete) {
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
        this.dCtx.user.saveUserChanges()
            .then(() => {
                this.dCtx.user.persona = null;
                this.user = null;
                this.registrationSuccess = true;
                this.mode = 'main';
            })
            .catch((reason) => {
                this.logWarning(reason, reason, true);
            });
    }
}