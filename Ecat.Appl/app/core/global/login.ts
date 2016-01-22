import IEcatStateProvider from 'core/provider/ecStateProvider'
import * as Enum from "appVars"
import IDataCtx from "core/service/data/context"
import ICommon from "core/service/common"
import ILocal from "core/service/data/local"

export default class EcGlobalLogin {
    static controllerId = 'app.global.login';
    static $inject = ['$scope','$state', '$stateParams','$timeout',IEcatStateProvider.providerId, IDataCtx.serivceId, ICommon.serviceId, ILocal.serviceId];
    badAccount = false;
    badInput = false;
    gender = Enum.EcMapGender;
    inFlight = false;
    isUserNameFieldLocked = false;
    mode = 'main';
    private logSucceess = this.common.logger.getLogFn(EcGlobalLogin.controllerId, Enum.EcMapAlertType.success);
    private logWarning = this.common.logger.getLogFn(EcGlobalLogin.controllerId, Enum.EcMapAlertType.warning);
    private logError = this.common.logger.getLogFn(EcGlobalLogin.controllerId, Enum.EcMapAlertType.danger);
    registrationSuccess = false;
    rememberMe = false;
    storePin = false;
    user: ecat.entity.IPerson;
    userEmail = '';
    userPassword = '';
    userRegForm: angular.IFormController;

    constructor(private $scope: angular.IScope,
        private $state: angular.ui.IStateService,
        params: any,
        private $timeout: angular.ITimeoutService,
    private stateMgr: IEcatStateProvider,
        private dataCtx: IDataCtx,
        private common: ICommon, 
        private local: ILocal
    ) {
        console.log('Login Controller Loaded');
        this.mode = params.mode;
        const reminder = localStorage.getItem('Ecat:RememberMe');
        this.rememberMe = !!reminder;

        if (this.rememberMe) {
            this.userEmail = reminder;
        }

        $scope.$on(common.coreCfg.globalEvent.saveChangesEvent, (data: any) => {
            this.inFlight = data.inflight;
        });
    }

    closeBadAccountAlert(): void { this.badAccount = false; }

    closeBadInputAlert(): void { this.badInput = false; }

    changeState(state: string): any {
        switch (state) {
        case 'register':
            if (this.user) {
                this.mode = state;
                return null;
            }
            const user = this.dataCtx.user.createUserLocal(true);
            this.mode = state;
            this.user = user;
            break;
        default:
            this.mode = state;
        }
    }

    logMeIn(user): void {
        const self = this;
       
        function logInSuccess(loginUser: ecat.entity.IPerson): void {
            if (loginUser.isRegistrationComplete) {
                self.$state.go(self.stateMgr.global.dashboard.name);
            } else {
                self.$state.go(self.stateMgr.global.profile.name);
            }
        }

        function loginError(error): void {
            self.badAccount = true;
            self.logWarning(error, error, true);
            self.registrationSuccess = false;
            self.$timeout(() => {
                self.badAccount = false;
            }, 2000);
        }

        this.dataCtx.user.loginUser(this.userEmail, this.userPassword, this.rememberMe)
            .then(logInSuccess)
            .catch(loginError);

    }

    processRegistration(): void {
        this.dataCtx.user.saveUserChanges()
            .then(() => {
                this.dataCtx.user.persona = null;
                this.user = null;
                this.registrationSuccess = true;
                this.mode = 'main';
            })
            .catch((reason) => {
                this.logWarning(reason, reason, true);
            });
    }
}