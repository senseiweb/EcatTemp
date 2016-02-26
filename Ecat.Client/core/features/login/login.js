System.register(["core/common/commonService", "core/common/mapStrings", "core/common/mapEnum", "core/service/data/context"], function(exports_1) {
    var commonService_1, _mp, _mpe, context_1;
    var EcGlobalLogin;
    return {
        setters:[
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            },
            function (_mpe_1) {
                _mpe = _mpe_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            }],
        execute: function() {
            EcGlobalLogin = (function () {
                function EcGlobalLogin($scope, $timeout, c, dCtx) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.c = c;
                    this.dCtx = dCtx;
                    this.badAccount = false;
                    this.gender = _mp.EcMapGender;
                    this.inFlight = false;
                    this.logSucceess = this.c.logSuccess('Login Controller');
                    this.logWarning = this.c.logWarning('Login Controller');
                    this.logError = this.c.logError('Login Controller');
                    this.mode = 'main';
                    this.registrationSuccess = false;
                    this.rememberMe = false;
                    this.userEmail = '';
                    this.userPassword = '';
                    console.log('Login Controller Loaded');
                    this.mode = c.$stateParams.mode;
                    var reminder = localStorage.getItem('ECAT:RME');
                    this.rememberMe = !!reminder;
                    this.user = dCtx.user.persona;
                    if (this.rememberMe) {
                        this.userEmail = reminder;
                    }
                    $scope.$on(c.coreCfg.coreApp.events.saveChangesEvent, function (data) {
                        _this.inFlight = data.inflight;
                    });
                }
                EcGlobalLogin.prototype.closeBadAccountAlert = function () { this.badAccount = false; };
                EcGlobalLogin.prototype.changeState = function (state) {
                    var _this = this;
                    switch (state) {
                        case 'register':
                            if (this.user) {
                                return null;
                            }
                            this.dCtx.user.createUserLocal(true).then(function (user) {
                                _this.user = user;
                            });
                            this.userEmail = null;
                            this.userPassword = null;
                            break;
                        default:
                            this.mode = state;
                    }
                    this.badAccount = false;
                    this.mode = state;
                };
                EcGlobalLogin.prototype.logMeIn = function ($event) {
                    if ($event && $event.keyCode !== 13 /* Enter */) {
                        return null;
                    }
                    var self = this;
                    this.badAccount = false;
                    function logInSuccess(loginUser) {
                        if (loginUser.registrationComplete) {
                            self.c.$state.go(self.c.stateMgr.core.dashboard.name);
                        }
                        else {
                            self.c.$state.go(self.c.stateMgr.core.profile.name);
                        }
                    }
                    function loginError(error) {
                        self.badAccount = true;
                        self.logWarning('Could not located an account matching those credentials', error, true);
                        self.registrationSuccess = false;
                    }
                    this.dCtx.user.loginUser(this.userEmail, this.userPassword, this.rememberMe)
                        .then(logInSuccess)
                        .catch(loginError);
                };
                EcGlobalLogin.prototype.processRegistration = function () {
                    var _this = this;
                    this.dCtx.user.saveChanges()
                        .then(function () {
                        _this.dCtx.user.persona = null;
                        _this.user = null;
                        _this.registrationSuccess = true;
                        _this.mode = 'main';
                    })
                        .catch(function (reason) {
                        _this.logWarning(reason, reason, true);
                    });
                };
                EcGlobalLogin.controllerId = 'app.global.login';
                EcGlobalLogin.$inject = ['$scope', '$timeout', commonService_1.default.serviceId, context_1.default.serviceId];
                return EcGlobalLogin;
            })();
            exports_1("default", EcGlobalLogin);
        }
    }
});
