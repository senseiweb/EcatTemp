import IUtilityRepo from 'core/service/data/utility'
import ICommon from "core/common/commonService"
import IDataCtx from "core/service/data/context"
import IEmFactory from 'core/service/data/emFactory'
import {userPeronCfg} from "core/entityExtension/person"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

interface IUserApiResources extends ecat.IApiResources {
    checkEmail: ecat.IApiResource;
    login: ecat.IApiResource;
    profile: ecat.IApiResource;
    userToken: ecat.IApiResource;
}

interface ICachedUserData {
    token: boolean;
    profile: boolean;
}

export default class EcUserRepo extends IUtilityRepo {
    static serviceId = 'data.user';
    static $inject = ['$http', '$injector', 'userStatic'];

    isLoggedIn = false;
    private userApiResources: IUserApiResources = {
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
            resource:  'Profiles'
          },
        userToken: {
            resource: 'Token',
            returnedEntityType: _mp.EcMapEntityType.unk
        }
    };
    persona: ecat.entity.IPerson;
    token: ecat.ILocalToken = {
        userEmail: '',
        password: '',
        auth: '',
        warning: new Date(),
        expire: new Date(),
        validity(): _mpe.TokenStatus {
            if (!this.auth || !this.expire) {
                return _mpe.TokenStatus.Missing;
            }
            const now = new Date();
            if (this.expire < now) {
                return _mpe.TokenStatus.Expired;
            }
            return _mpe.TokenStatus.Valid;
        }
    };

    constructor(private $http: angular.IHttpService, inj, public userStatic: ecat.entity.ILoginToken) {
        super(inj, 'User Data Service', _mp.EcMapApiResource.user, [userPeronCfg]);
        super.addResources(this.userApiResources);
        this.createUserToken();
    }

    createUserLocal(addSecurity: boolean): breeze.promises.IPromise<ecat.entity.IPerson | angular.IPromise<void>> {

        const self = this;

        if (!this.mgrLoaded) {
            return this.loadManager(this.apiResources)
                .then(createUserLcl)
                .catch(this.queryFailed);
        }

        return this.c.$q.when(createUserLcl());

        function createUserLcl(): ecat.entity.IPerson {
            const newPerson = {
                registrationComplete: false,
                mpInstituteRole: this.c.appVar.EcMapInstituteRole.external
            };

            const user = self.manager.createEntity(this.c.appVar.EcMapEntityType.person, newPerson) as ecat.entity.IPerson;

            user.mpAffiliation = _mp.EcMapAffiliation.unk;
            user.mpComponent = _mp.EcMapComponent.unk;
            user.mpPaygrade = _mp.EcMapPaygrade.unk;
            user.mpGender = _mp.EcMapGender.unk;

            return user;
        }
    }

    createUserToken(): ecat.entity.ILoginToken {
        const isLoaded: ICachedUserData = this.isLoaded;
        if (isLoaded.token || !this.mgrLoaded || !this.userStatic) {
            return null;
        }

        this.persona = this.manager.createEntity(_mp.EcMapEntityType.person, this.userStatic.person, breeze.EntityState.Unchanged) as ecat.entity.IPerson;

        const newToken = {
            personId: this.persona.personId,
            person: this.persona,
            tokenExpire: this.userStatic.tokenExpire,
            tokenExpireWarning: this.userStatic.tokenExpireWarning,
            authToken: this.userStatic.authToken
        } as ecat.entity.ILoginToken;

        const token = this.manager.createEntity(_mp.EcMapEntityType.loginTk,
            newToken, breeze.EntityState.Unchanged) as ecat.entity.ILoginToken;

        this.token.expire = token.tokenExpire;
        this.token.auth = token.authToken;
        this.token.warning = token.tokenExpireWarning;

        return token;
    }

    emailIsUnique(email: string): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        const requestCfg: angular.IRequestConfig = {
            method: 'get',
            url: `${this.c.appEndpoint + this.endPoint}/${this.userApiResources.checkEmail.resource}`,
            params: { email: email }
        }

        function emailIsUniqueResponse(result: angular.IHttpPromiseCallbackArg<boolean>) {
            return result.data;
        }

        return this.$http(requestCfg)
            .then(emailIsUniqueResponse)
            .catch(this.queryFailed);
    }

    getUserProfile(): breeze.promises.IPromise<Array<ecat.entity.IProfile> | angular.IPromise<void>> {
        const self = this;
        const res = this.userApiResources.profile.resource;
        const isLoaded =  this.isLoaded as ICachedUserData;

        if (isLoaded.profile) {
            const pred = new breeze.Predicate('personId', breeze.FilterQueryOp.Equals, this.persona.personId);
            return this.c.$q.when(this.queryLocal(res, null, pred) as Array<ecat.entity.IProfile>);
        }

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getUserProfileResponse)
            .catch(this.queryFailed);

        function getUserProfileResponse(userProfileResult: breeze.QueryResult) {
            const userProfiles = userProfileResult.results as Array<ecat.entity.IProfile>;

            const profile = { personId: self.persona.personId }
            let profileEntity: ecat.entity.IProfile;
            const userRole = self.persona.mpInstituteRole;
            const roles = _mp.EcMapInstituteRole;

            switch (userRole) {
                case roles.student:
                    if (!self.persona.student) {
                        profileEntity = self.manager.createEntity(_mp.EcMapEntityType.studProfile, profile) as ecat.entity.IProfile;
                    }
                    break;
                case roles.faculty:
                    if (!self.persona.faculty) {
                        profileEntity = self.manager.createEntity(_mp.EcMapEntityType.facProfile, profile) as ecat.entity.IProfile;
                    }
                    break;
                case roles.hqAdmin:
                    if (!self.persona.hqStaff) {
                        profileEntity = self.manager.createEntity(_mp.EcMapEntityType.hqStaffProfile, profile) as ecat.entity.IProfile;
                    }
                    break;
                case _mp.EcMapInstituteRole.external:
                    if (!self.persona.external) {
                        profileEntity = self.manager.createEntity(_mp.EcMapEntityType.externalProfile, profile) as ecat.entity.IProfile;
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
    }

    isAuthorized(authorizedRoles: Array<string>): angular.IPromise<any> {
        const deferred = this.c.$q.defer();

        const isAuthorized = authorizedRoles.some((role) => this.persona.mpInstituteRole === role);
        if (!isAuthorized) {
            const routingError: ecat.IRoutingError = {
                errorCode: _mpe.SysErrorType.NotAuthorized,
                message: 'You do not have the appropriate authorization level to access that resources',
                redirectTo: this.c.stateMgr.core.dashboard.name
            }
            deferred.reject(routingError);
        } else {
            deferred.resolve(true);
        }

        return deferred.promise;
    }

    loginUser(userEmail: string, password: string, saveLogin: boolean): breeze.promises.IPromise<ecat.entity.IPerson | angular.IPromise<void>> {

        const isLoad = this.isLoaded as ICachedUserData;

        if (this.token && userEmail === this.token.userEmail && password === this.token.password && this.token.validity() === _mpe.TokenStatus.Valid) {
            return this.c.$q.resolve(this.persona);
        }

        this.dCtx.logoutUser();

        const self = this;
        const requestCfg: angular.IRequestConfig = {
            method: 'POST',
            url: `${this.c.tokenEndpoint}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                username: userEmail,
                password: password,
                "grant_type": 'password'
            },
            transformRequest: (params) => {
                const str = [];
                for (let param in params) {
                    if (!params.hasOwnProperty(param)) {
                        return null;
                    }
                    str.push(`${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`);
                }
                return str.join('&');
            }
        }

        return this.$http(requestCfg)
            .then(loginUserResponse)
            .catch(this.queryFailed);

        function loginUserResponse(result: angular.IHttpPromiseCallbackArg<any>) {
            const token = JSON.parse(result.data.loginToken) as ecat.entity.ILoginToken;
            const user = angular.copy(token.person);

            self.persona = self.manager.createEntity(_mp.EcMapEntityType.person, user, breeze.EntityState.Unchanged, breeze.MergeStrategy.PreserveChanges) as ecat.entity.IPerson;

            self.token.auth = result.data.access_token;
            self.token.expire = new Date(token.tokenExpire as any);
            self.token.warning = new Date(token.tokenExpireWarning as any);
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
            } else {
                localStorage.removeItem('ECAT:RME');
            }

            isLoad.token = true;
            self.isLoggedIn = true;
            return user;
        }
    };

    logout(): void {
        this.isLoaded.token = false;
    }

}


