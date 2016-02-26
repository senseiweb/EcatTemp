System.register(['core/service/logger', "core/config/cfgProviders", "sweetalert", "core/common/mapStrings", "core/common/mapEnum", 'moment'], function(exports_1) {
    var logger_1, cfgProviders_1, sweetalert_1, _mp, _mpe, moment_1;
    var EcatCommonService;
    return {
        setters:[
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (cfgProviders_1_1) {
                cfgProviders_1 = cfgProviders_1_1;
            },
            function (sweetalert_1_1) {
                sweetalert_1 = sweetalert_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            },
            function (_mpe_1) {
                _mpe = _mpe_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }],
        execute: function() {
            EcatCommonService = (function () {
                function EcatCommonService(inj, $location, $q, $rootScope, $state, $stateParams, logger, coreCfg, stateMgr, userStatic) {
                    var _this = this;
                    this.inj = inj;
                    this.$location = $location;
                    this.$q = $q;
                    this.$rootScope = $rootScope;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.logger = logger;
                    this.coreCfg = coreCfg;
                    this.stateMgr = stateMgr;
                    this.userStatic = userStatic;
                    this.localStorageKeysBak = {
                        userId: 'ECAT:UID',
                        appServer: 'ECAT:APPSERVER',
                        clientProfile: "ECAT:CLIENTPROFILE:" + this.localStorageUid
                    };
                    this.getAllLoggers = function (loggerTitle) { return ({
                        succes: function () { return _this.logger.getLogFn(loggerTitle, 3 /* Success */); },
                        error: function () { return _this.logger.getLogFn(loggerTitle, 1 /* Error */); },
                        warn: function () { return _this.logger.getLogFn(loggerTitle, 2 /* Warning */); },
                        info: function () { return _this.logger.getLogFn(loggerTitle, 0 /* Info */); }
                    }); };
                    this.logSuccess = function (controllerId) { return _this.logger.getLogFn(controllerId, 3 /* Success */); };
                    this.logError = function (controllerId) { return _this.logger.getLogFn(controllerId, 1 /* Error */); };
                    this.logWarning = function (controllerId) { return _this.logger.getLogFn(controllerId, 2 /* Warning */); };
                    this.logInfo = function (controllerId) { return _this.logger.getLogFn(controllerId, 0 /* Info */); };
                    this.moment = moment_1.default;
                    this.workingRouterError = false;
                    this.swal = sweetalert_1.default;
                    var environment = window.localStorage.getItem(this.localStorageKeysBak.appServer);
                    this.serverEnvironment = environment || window.location.protocol + "//" + window.location.host;
                    this.appEndpoint = this.serverEnvironment + "/breeze/";
                    this.tokenEndpoint = this.serverEnvironment + "/ecat-token";
                }
                Object.defineProperty(EcatCommonService.prototype, "localStorageKeys", {
                    get: function () { return this.localStorageKeysBak; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(EcatCommonService.prototype, "localStorageUid", {
                    get: function () {
                        return localStorage.getItem((this.localStorageKeys) ? this.localStorageKeys.userId : 'unknown');
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                EcatCommonService.prototype.appStartup = function () {
                    var _this = this;
                    this.$rootScope.$on('$stateChangeStart', function ($event, to, toParams, from, fromParams) {
                        var dCtx = _this.inj.get('data.context');
                        if (!to.data || (!angular.isArray(to.data.authorized) && !angular.isDefined(to.data.validateToken))) {
                            return true;
                        }
                        if (angular.isArray(to.data.authorized)) {
                            _this.checkUserRoles(dCtx.user.persona, to.data.authorized, $event);
                        }
                    });
                    this.$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, routeError) {
                        if (angular.isObject(routeError)) {
                            var error = routeError;
                            event.preventDefault();
                            switch (error.errorCode) {
                                case _mpe.SysErrorType.AuthNoToken:
                                case _mpe.SysErrorType.AuthExpired:
                                    var tkError = {
                                        title: 'Registration Error',
                                        text: error.message,
                                        type: 'error',
                                        closeOnConfirm: true
                                    };
                                    sweetalert_1.default(tkError, function () {
                                        _this.$state.go(error.redirectTo);
                                    });
                                    break;
                                case _mpe.SysErrorType.RegNotComplete:
                                    var regError = {
                                        title: 'Registration Error',
                                        text: error.message,
                                        type: 'error',
                                        closeOnConfirm: true
                                    };
                                    sweetalert_1.default(regError, function () {
                                        _this.$state.go(error.redirectTo, null, { notify: false });
                                    });
                                    break;
                                case _mpe.SysErrorType.NotAuthorized:
                                    var alertSetting = {
                                        title: 'Authorization Error',
                                        text: error.message,
                                        type: 'error',
                                        closeOnConfirm: true
                                    };
                                    sweetalert_1.default(alertSetting, function () {
                                        _this.$state.go(error.redirectTo);
                                    });
                                    break;
                                default:
                                    console.log(error.message);
                            }
                        }
                        else {
                            console.log('Routing Error Occured', routeError);
                        }
                    });
                };
                EcatCommonService.prototype.broadcast = function (event) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    this.$rootScope.$broadcast(event, args);
                };
                EcatCommonService.prototype.checkUserRoles = function (user, authorizedRoles, event) {
                    var deferred = this.$q.defer();
                    var userRole = (user) ? user.mpInstituteRole :
                        (this.userStatic) ? this.userStatic.person.mpInstituteRole :
                            _mp.EcMapInstituteRole.external;
                    if (!authorizedRoles.some(function (role) { return role === userRole; })) {
                        event.preventDefault();
                        var alertError = {
                            redirectTo: 'app.main.dashboard',
                            errorCode: _mpe.SysErrorType.NotAuthorized,
                            message: 'You are attempting to access a resource that requires an authorization level that you current do not have.'
                        };
                        deferred.reject(alertError);
                    }
                    else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                };
                EcatCommonService.prototype.checkValidToken = function (existDefer) {
                    var _this = this;
                    var deferred = existDefer ? existDefer : this.$q.defer();
                    var dCtx = this.inj.get('data.context');
                    if (!dCtx.user.mgrLoaded) {
                        var off = this.$rootScope.$on(this.coreCfg.coreApp.events.managerLoaded, function (event, data) {
                            if (data[0].loaded && data[0].mgrName === 'User') {
                                off();
                                dCtx.user.createUserToken();
                                _this.checkValidToken(deferred);
                            }
                        });
                        return deferred.promise;
                    }
                    var tokenStatus = dCtx.user.token.validity();
                    if (tokenStatus === 2 /* Valid */) {
                        deferred.resolve(true);
                        return deferred.promise;
                    }
                    if (this.workingRouterError) {
                        deferred.reject("Working an error");
                        return deferred.promise;
                    }
                    var error = {
                        errorCode: _mpe.SysErrorType.Undefined,
                        redirectTo: '',
                        params: {},
                        message: ''
                    };
                    if (tokenStatus === 1 /* Expired */) {
                        error.errorCode = _mpe.SysErrorType.AuthExpired;
                        error.redirectTo = this.stateMgr.core.login.name;
                        error.message = 'You authenication token has expired.';
                        error.params = { mode: 'lock' };
                        this.workingRouterError = true;
                        deferred.reject(error);
                    }
                    if (tokenStatus === 0 /* Missing */) {
                        error.errorCode = _mpe.SysErrorType.AuthNoToken;
                        error.redirectTo = this.stateMgr.core.login.name;
                        error.message = 'You authenication token was not found. Please login.';
                        error.params = { mode: 'login' };
                        this.workingRouterError = true;
                        deferred.reject(error);
                    }
                    return deferred.promise;
                };
                EcatCommonService.serviceId = 'core.service.common';
                EcatCommonService.$inject = ['$injector', '$location', '$q', '$rootScope', '$state', '$stateParams', logger_1.default.serviceId, cfgProviders_1.default.appCfgProvider.id, cfgProviders_1.default.stateConfigProvider.id, 'userStatic'];
                return EcatCommonService;
            })();
            exports_1("default", EcatCommonService);
        }
    }
});
