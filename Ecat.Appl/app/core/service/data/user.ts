import IUtilityRepo from 'core/service/data/utility'
import ICommon from 'core/service/common'
import IDataCtx from "core/service/data/context"
import IEmFactory from 'core/service/data/emFactory'
import * as IPersonExt from "core/config/entityExtension/person"
import * as IAppVar from "appVars"

interface UserApiResources extends ecat.IApiResources {
    checkEmail: ecat.IApiResource;
    login: ecat.IApiResource;
    profile: ecat.IApiResource;
}

export default class EcUserRepo extends IUtilityRepo
{
    static serviceId = 'data.user';
    static $inject = ['$http','$injector', 'userStatic'];

    private apiResources: UserApiResources = {
        checkEmail: {
            returnedEntityType: this.c.appVar.EcMapEntityType.unk,
            resourceName: 'CheckUserEmail'
        },
        login: {
            returnedEntityType: this.c.appVar.EcMapEntityType.person,
            resourceName: 'Login'
        },
        profile: {
            returnedEntityType: this.c.appVar.EcMapEntityType.unk,
            resourceName: 'Profiles'
        }
    };
    isLoaded = this.c.areItemsLoaded;
    persona: ecat.entity.IPerson;
    private resource = this.apiResources;
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
        super(inj,'User Data Service', IAppVar.EcMapApiResource.user, [IPersonExt.personConfig]);
       
    }

    createUserLocal(addSecurity: boolean): ecat.entity.IPerson {

         const newPerson = {
             isRegistrationComplete: false,
             mpInstituteRole: this.c.appVar.EcMapInstituteRole.external
         };

         const user = this.manager.createEntity(this.c.appVar.EcMapEntityType.person, newPerson) as ecat.entity.IPerson;

         user.mpMilAffiliation = this.c.appVar.EcMapAffiliation.unk;
         user.mpMilComponent = this.c.appVar.EcMapComponent.unk;
         user.mpMilPaygrade = this.c.appVar.EcMapPaygrade.unk;
         user.mpGender = this.c.appVar.EcMapGender.unk;

         if (addSecurity) {
             user.security = this.manager.createEntity(this.c.appVar.EcMapEntityType.security, { personId: user.personId }) as ecat.entity.ISecurity;
         }

         return user;
    }

    createUserToken(): ecat.entity.ILoginToken {
        let security: ecat.entity.ISecurity = null;

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
            url: `${this.c.appEndpoint + this.endPoint}/${this.resource.checkEmail.resourceName}`,
            params: { email: email }
        }

        function emailIsUniqueResponse(result: angular.IHttpPromiseCallbackArg<boolean>) {
            return result.data;
        }

        return this.$http(requestCfg)
            .then(emailIsUniqueResponse)
            .catch(this.queryFailed);
    }

    getUserProfile(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.resource.profile.resourceName;

        if (this.isLoaded.userProfile) {
            const pred = new breeze.Predicate('personId', breeze.FilterQueryOp.Equals, this.persona.personId);
            return this.c.$q.when(this.queryLocal(res, null, pred));
        }

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getUserProfileResponse)
            .catch(this.queryFailed);

        function getUserProfileResponse(userProfileResult: breeze.QueryResult) {
            const userProfile = userProfileResult.results[0];
            if (userProfile) {
                return userProfile;
            }

            const profile = { personId: self.persona.personId }

            switch (self.persona.mpInstituteRole) {
                case self.c.appVar.EcMapInstituteRole.student:
                    return self.manager.createEntity(self.c.appVar.EcMapEntityType.studProfile, profile);
                case self.c.appVar.EcMapInstituteRole.facilitator:
                    return self.manager.createEntity(self.c.appVar.EcMapEntityType.facProfile, profile);
                case self.c.appVar.EcMapInstituteRole.external:
                    return self.manager.createEntity(self.c.appVar.EcMapEntityType.externalProfile, profile);
                default:
                    return null;
            }
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

    loadUserManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {

        if (true) {
            return this.c.$q.when(true);
        }

        return this.loadManager(this.apiResources)
            .then(() => {
                this.registerTypes(this.apiResources);
                if (this.userStatic) {
                    this.createUserToken();
                    return true;
                } else {
                    return false;
                }
            })
            .catch(this.queryFailed);
    }

    loginUser(userEmail: string, password: string, saveLogin: boolean): breeze.promises.IPromise<ecat.entity.IPerson | angular.IPromise<void>> {
        if (this.token && userEmail === this.token.userEmail && password === this.token.password && this.token.validity() === this.c.appVar.TokenStatus.Valid) {
            return this.c.$q.resolve(this.persona);
        }

        this.dCtx.logoutUser();
        
        const self = this;
        const requestCfg: angular.IRequestConfig = {
            method: 'POST',
            url: `${this.c.serverEnvironment}/token`,
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

            self.isLoaded.userToken = true;
            self.isLoaded.user = true;
            return user;
        }     
    };

    saveUserChanges(): breeze.promises.IPromise<breeze.SaveResult> { return this.saveChanges(); }  
}


