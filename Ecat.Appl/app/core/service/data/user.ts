import IUtilityRepo from 'core/service/data/utility'
import ICommon from 'core/service/common'
import IDataCtx from "core/service/data/context"
import IEmFactory from 'core/service/data/emFactory'
import * as IPersonExt from "core/config/entityExtension/person"
import * as IAppVar from "appVars"

export interface IUserApiResources extends ecat.IApiResources {
    checkEmail: ecat.IApiResource;
    login: ecat.IApiResource;
    profile: ecat.IApiResource;
    userToken: ecat.IApiResource;
}

export default class EcUserRepo extends IUtilityRepo
{
    static serviceId = 'data.user';
    static $inject = ['$http','$injector', 'userStatic'];

    isLoggedIn = false;
    userApiResources: IUserApiResources = {
        checkEmail: {
            returnedEntityType: this.c.appVar.EcMapEntityType.unk,
            resource: {
                name: 'CheckUserEmail',
                isLoaded: false
            }
        },
        login: {
            returnedEntityType: this.c.appVar.EcMapEntityType.person,
            resource: {
                name: 'Login',
                isLoaded: false
            }
        },
        profile: {
            returnedEntityType: this.c.appVar.EcMapEntityType.unk,
            resource: {
                name: 'Profiles',
                isLoaded: false
            }
        },
        userToken: {
            resource: {
                name: 'Token',
                isLoaded: false
            },
            returnedEntityType: this.c.appVar.EcMapEntityType.unk
        }
    };
    persona: ecat.entity.IPerson;
    token: ecat.ILocalToken = {
        userEmail: '',
        password: '',
        auth: '',
        warning: new Date(),
        expire: new Date(),
        validity(): IAppVar.TokenStatus {
            if (!this.auth || !this.expire) {
                return IAppVar.TokenStatus.Missing;
            }
            const now = new Date();
            if (this.expire < now) {
                return IAppVar.TokenStatus.Expired;
            }
            return IAppVar.TokenStatus.Valid;
        }
    };

    constructor(private $http: angular.IHttpService, inj, public userStatic: ecat.entity.ILoginToken) {
        super(inj, 'User Data Service', IAppVar.EcMapApiResource.user, [IPersonExt.personConfig]);
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

            user.mpAffiliation = self.c.appVar.EcMapAffiliation.unk;
            user.mpComponent = self.c.appVar.EcMapComponent.unk;
            user.mpPaygrade = self.c.appVar.EcMapPaygrade.unk;
            user.mpGender = self.c.appVar.EcMapGender.unk;

            if (addSecurity) {
                user.security = self.manager.createEntity(self.c.appVar.EcMapEntityType.security, { personId: user.personId }) as ecat.entity.ISecurity;
            }

            return user;
        }
       
    }

    createUserToken(): ecat.entity.ILoginToken {
        let security: ecat.entity.ISecurity = null;
        const resource = this.userApiResources.userToken.resource;
        if (resource.isLoaded || !this.mgrLoaded || !this.userStatic) {
            return null;
        }

        if (this.userStatic.person.security) {
            security = this.manager.createEntity(this.c.appVar.EcMapEntityType.security, this.userStatic.person.security, breeze.EntityState.Unchanged) as ecat.entity.ISecurity;
        }

        this.persona = this.manager.createEntity(this.c.appVar.EcMapEntityType.person, this.userStatic.person, breeze.EntityState.Unchanged) as ecat.entity.IPerson;

        this.persona.security = security;

        const newToken = {
            personId: this.persona.personId,
            person: this.persona,
            tokenExpire: this.userStatic.tokenExpire,
            tokenExpireWarning: this.userStatic.tokenExpireWarning,
            authToken: this.userStatic.authToken
        } as ecat.entity.ILoginToken;

        const token = this.manager.createEntity(this.c.appVar.EcMapEntityType.loginTk,
            newToken, breeze.EntityState.Unchanged) as ecat.entity.ILoginToken;

        this.token.expire = token.tokenExpire;
        this.token.auth = token.authToken;
        this.token.warning = token.tokenExpireWarning;

        return token;
    }

    emailIsUnique(email: string): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        const requestCfg: angular.IRequestConfig = {
            method: 'get',
            url: `${this.c.appEndpoint + this.endPoint}/${this.userApiResources.checkEmail.resource.name}`,
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

        if (res.isLoaded) {
            const pred = new breeze.Predicate('personId', breeze.FilterQueryOp.Equals, this.persona.personId);
            return this.c.$q.when(this.queryLocal(res.name, null, pred) as Array<ecat.entity.IProfile> ) ;
        }

        return this.query.from(res.name)
            .using(this.manager)
            .execute()
            .then(getUserProfileResponse)
            .catch(this.queryFailed);
            
        function getUserProfileResponse(userProfileResult: breeze.QueryResult) {
            const userProfiles = userProfileResult.results as Array<ecat.entity.IProfile>;
         
            const profile = { personId: self.persona.personId }
            let profileEntity: ecat.entity.IProfile;
            const profiles = [];

            switch (self.persona.mpInstituteRole) {
                case self.c.appVar.EcMapInstituteRole.student:
                    profileEntity = self.manager.createEntity(self.c.appVar.EcMapEntityType.studProfile, profile) as ecat.entity.IProfile;
                    break;
                case self.c.appVar.EcMapInstituteRole.facilitator:
                    profileEntity = self.manager.createEntity(self.c.appVar.EcMapEntityType.facProfile, profile) as ecat.entity.IProfile;
                    break;
                case self.c.appVar.EcMapInstituteRole.external:
                    profileEntity = self.manager.createEntity(self.c.appVar.EcMapEntityType.externalProfile, profile) as ecat.entity.IProfile;
                    break;
                default:
                    profileEntity = self.manager.createEntity(self.c.appVar.EcMapEntityType.externalProfile, profile) as ecat.entity.IProfile;
            }

            profiles.push(profileEntity);
        }
    }

    isAuthorized(authorizedRoles: Array<string>): angular.IPromise<any> {
        const deferred = this.c.$q.defer();

        const isAuthorized = authorizedRoles.some((role) => this.persona.mpInstituteRole === role);
        if (!isAuthorized) {
            const routingError: ecat.IRoutingError = {
                errorCode: this.c.appVar.SysErrorType.NotAuthorized,
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
        if (this.token && userEmail === this.token.userEmail && password === this.token.password && this.token.validity() === this.c.appVar.TokenStatus.Valid) {
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
                          return null;}
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

            self.persona = self.manager.createEntity(self.c.appVar.EcMapEntityType.person, user, breeze.EntityState.Unchanged, breeze.MergeStrategy.PreserveChanges) as ecat.entity.IPerson;

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

            self.userApiResources.userToken.resource.isLoaded = true;
            self.isLoggedIn = true;
            return user;
        }     
    };

    saveUserChanges(): breeze.promises.IPromise<breeze.SaveResult> { return this.saveChanges(); }  
}


