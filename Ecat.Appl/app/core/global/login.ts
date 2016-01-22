import IEcatStateProvider from 'core/provider/ecStateProvider'
import * as Enum from "appVars"
import IDataCtx from "core/service/data/context"
import ICommon from "core/service/common"
import ILocal from "core/service/data/local"

export default class EcGlobalLogin {
    static controllerId = 'app.global.login';
    static $inject = ['$scope','$state', '$stateParams','$timeout',IEcatStateProvider.providerId, IDataCtx.serivceId, ICommon.serviceId, ILocal.serviceId];
    badAccount = false;
    gender = Enum.EcMapGender;
    inFlight = false;
    mode = 'main';
    private logSucceess = this.common.logger.getLogFn(EcGlobalLogin.controllerId, Enum.EcMapAlertType.success);
    private logWarning = this.common.logger.getLogFn(EcGlobalLogin.controllerId, Enum.EcMapAlertType.warning);
    private logError = this.common.logger.getLogFn(EcGlobalLogin.controllerId, Enum.EcMapAlertType.danger);
    registrationSuccess = false;
    rememberMe = false;
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
        const reminder = localStorage.getItem('ECAT:RME');
        this.rememberMe = !!reminder;

        if (this.rememberMe) {
            this.userEmail = reminder;
        }

        $scope.$on(common.coreCfg.globalEvent.saveChangesEvent, (data: any) => {
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
            const user = this.dataCtx.user.createUserLocal(true);
            this.user = user;
            this.userEmail = null;
            this.userPassword = null;
            break;
        default:
            this.mode = state;
        }

        this.mode = state;
    }

    logMeIn(user): void {
        const self = this;
        this.badAccount = false;
        function logInSuccess(loginUser: ecat.entity.IPerson): void {
            if (loginUser.isRegistrationComplete) {
                self.$state.go(self.stateMgr.global.dashboard.name);
            } else {
                self.$state.go(self.stateMgr.global.profile.name);
            }
        }

        function loginError(error): void {
            self.badAccount = true;
            self.logWarning('Could not located an account matching those credentials', error, true);
            self.registrationSuccess = false;
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