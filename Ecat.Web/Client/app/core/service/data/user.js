System.register(['core/service/data/utility', "core/entityExtension/person", "core/common/mapStrings", "core/common/mapEnum"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var utility_1, _personExt, _mp, _mpe;
    var EcUserRepo;
    return {
        setters:[
            function (utility_1_1) {
                utility_1 = utility_1_1;
            },
            function (_personExt_1) {
                _personExt = _personExt_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            },
            function (_mpe_1) {
                _mpe = _mpe_1;
            }],
        execute: function() {
            EcUserRepo = (function (_super) {
                __extends(EcUserRepo, _super);
                function EcUserRepo($http, inj, userStatic) {
                    _super.call(this, inj, 'User Data Service', _mp.EcMapApiResource.user, [_personExt.personConfig]);
                    this.$http = $http;
                    this.userStatic = userStatic;
                    this.isLoggedIn = false;
                    this.userApiResources = {
                        checkEmail: {
                            returnedEntityType: _mp.EcMapEntityType.unk,
                            resource: 'CheckUserEmail'
                        },
                        login: {
                            returnedEntityType: _mp.EcMapEntityType.person,
                            resource: 'Login'
                        },
                        profile: {
                            returnedEntityType: _mp.EcMapEntityType.unk,
                            resource: 'Profiles'
                        },
                        userToken: {
                            resource: 'Token',
                            returnedEntityType: _mp.EcMapEntityType.unk
                        }
                    };
                    this.token = {
                        userEmail: '',
                        password: '',
                        auth: '',
                        warning: new Date(),
                        expire: new Date(),
                        validity: function () {
                            if (!this.auth || !this.expire) {
                                return 0 /* Missing */;
                            }
                            var now = new Date();
                            if (this.expire < now) {
                                return 1 /* Expired */;
                            }
                            return 2 /* Valid */;
                        }
                    };
                    _super.prototype.addResources.call(this, this.userApiResources);
                    this.createUserToken();
                }
                EcUserRepo.prototype.createUserLocal = function (addSecurity) {
                    var self = this;
                    if (!this.mgrLoaded) {
                        return this.loadManager(this.apiResources)
                            .then(createUserLcl)
                            .catch(this.queryFailed);
                    }
                    return this.c.$q.when(createUserLcl());
                    function createUserLcl() {
                        var newPerson = {
                            registrationComplete: false,
                            mpInstituteRole: this.c.appVar.EcMapInstituteRole.external
                        };
                        var user = self.manager.createEntity(this.c.appVar.EcMapEntityType.person, newPerson);
                        user.mpAffiliation = _mp.EcMapAffiliation.unk;
                        user.mpComponent = _mp.EcMapComponent.unk;
                        user.mpPaygrade = _mp.EcMapPaygrade.unk;
                        user.mpGender = _mp.EcMapGender.unk;
                        return user;
                    }
                };
                EcUserRepo.prototype.createUserToken = function () {
                    var isLoaded = this.isLoaded;
                    if (isLoaded.token || !this.mgrLoaded || !this.userStatic) {
                        return null;
                    }
                    this.persona = this.manager.createEntity(_mp.EcMapEntityType.person, this.userStatic.person, breeze.EntityState.Unchanged);
                    var newToken = {
                        personId: this.persona.personId,
                        person: this.persona,
                        tokenExpire: this.userStatic.tokenExpire,
                        tokenExpireWarning: this.userStatic.tokenExpireWarning,
                        authToken: this.userStatic.authToken
                    };
                    var token = this.manager.createEntity(_mp.EcMapEntityType.loginTk, newToken, breeze.EntityState.Unchanged);
                    this.token.expire = token.tokenExpire;
                    this.token.auth = token.authToken;
                    this.token.warning = token.tokenExpireWarning;
                    return token;
                };
                EcUserRepo.prototype.emailIsUnique = function (email) {
                    var requestCfg = {
                        method: 'get',
                        url: (this.c.appEndpoint + this.endPoint) + "/" + this.userApiResources.checkEmail.resource,
                        params: { email: email }
                    };
                    function emailIsUniqueResponse(result) {
                        return result.data;
                    }
                    return this.$http(requestCfg)
                        .then(emailIsUniqueResponse)
                        .catch(this.queryFailed);
                };
                EcUserRepo.prototype.getUserProfile = function () {
                    var self = this;
                    var res = this.userApiResources.profile.resource;
                    var isLoaded = this.isLoaded;
                    if (isLoaded.profile) {
                        var pred = new breeze.Predicate('personId', breeze.FilterQueryOp.Equals, this.persona.personId);
                        return this.c.$q.when(this.queryLocal(res, null, pred));
                    }
                    return this.query.from(res)
                        .using(this.manager)
                        .execute()
                        .then(getUserProfileResponse)
                        .catch(this.queryFailed);
                    function getUserProfileResponse(userProfileResult) {
                        var userProfiles = userProfileResult.results;
                        var profile = { personId: self.persona.personId };
                        var profileEntity;
                        var userRole = self.persona.mpInstituteRole;
                        var roles = _mp.EcMapInstituteRole;
                        switch (userRole) {
                            case roles.student:
                                if (!self.persona.student) {
                                    profileEntity = self.manager.createEntity(_mp.EcMapEntityType.studProfile, profile);
                                }
                                break;
                            case roles.faculty:
                                if (!self.persona.faculty) {
                                    profileEntity = self.manager.createEntity(_mp.EcMapEntityType.facProfile, profile);
                                }
                                break;
                            case roles.hqAdmin:
                                if (!self.persona.hqStaff) {
                                    profileEntity = self.manager.createEntity(_mp.EcMapEntityType.hqStaffProfile, profile);
                                }
                                break;
                            case _mp.EcMapInstituteRole.external:
                                if (!self.persona.external) {
                                    profileEntity = self.manager.createEntity(_mp.EcMapEntityType.externalProfile, profile);
                                }
                                break;
                            default:
                                profileEntity = null;
                        }
                        if (profileEntity) {
                            userProfiles.push(profileEntity);
                        }
                        isLoaded.profile = userProfiles.length > 0;
                        return userProfiles;
                    }
                };
                EcUserRepo.prototype.isAuthorized = function (authorizedRoles) {
                    var _this = this;
                    var deferred = this.c.$q.defer();
                    var isAuthorized = authorizedRoles.some(function (role) { return _this.persona.mpInstituteRole === role; });
                    if (!isAuthorized) {
                        var routingError = {
                            errorCode: _mpe.SysErrorType.NotAuthorized,
                            message: 'You do not have the appropriate authorization level to access that resources',
                            redirectTo: this.c.stateMgr.core.dashboard.name
                        };
                        deferred.reject(routingError);
                    }
                    else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                };
                EcUserRepo.prototype.loginUser = function (userEmail, password, saveLogin) {
                    var isLoad = this.isLoaded;
                    if (this.token && userEmail === this.token.userEmail && password === this.token.password && this.token.validity() === 2 /* Valid */) {
                        return this.c.$q.resolve(this.persona);
                    }
                    this.dCtx.logoutUser();
                    var self = this;
                    var requestCfg = {
                        method: 'POST',
                        url: "" + this.c.tokenEndpoint,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: {
                            username: userEmail,
                            password: password,
                            "grant_type": 'password'
                        },
                        transformRequest: function (params) {
                            var str = [];
                            for (var param in params) {
                                if (!params.hasOwnProperty(param)) {
                                    return null;
                                }
                                str.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
                            }
                            return str.join('&');
                        }
                    };
                    return this.$http(requestCfg)
                        .then(loginUserResponse)
                        .catch(this.queryFailed);
                    function loginUserResponse(result) {
                        var token = JSON.parse(result.data.loginToken);
                        var user = angular.copy(token.person);
                        self.persona = self.manager.createEntity(_mp.EcMapEntityType.person, user, breeze.EntityState.Unchanged, breeze.MergeStrategy.PreserveChanges);
                        self.token.auth = result.data.access_token;
                        self.token.expire = new Date(token.tokenExpire);
                        self.token.warning = new Date(token.tokenExpireWarning);
                        self.token.userEmail = userEmail;
                        self.token.password = password;
                        if (saveLogin) {
                            localStorage.setItem('ECAT:RME', userEmail);
                            localStorage.setItem('ECAT:TOKEN', JSON.stringify({
                                personId: token.person.personId,
                                person: token.person,
                                authToken: self.token.auth,
                                tokenExpireWarning: self.token.warning,
                                tokenExpire: self.token.expire
                            }));
                        }
                        else {
                            localStorage.removeItem('ECAT:RME');
                        }
                        isLoad.token = true;
                        self.isLoggedIn = true;
                        return user;
                    }
                };
                ;
                EcUserRepo.prototype.logout = function () {
                    this.isLoaded.token = false;
                };
                EcUserRepo.serviceId = 'data.user';
                EcUserRepo.$inject = ['$http', '$injector', 'userStatic'];
                return EcUserRepo;
            })(utility_1.default);
            exports_1("default", EcUserRepo);
        }
    }
});
