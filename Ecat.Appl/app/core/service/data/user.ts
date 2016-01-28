import IUtilityRepo from 'core/service/data/utility'
import ICommon from 'core/service/common'
import ICoreStates from "core/config/states/core"
import * as IAppVar from "appVars"
import IEntityFactory from 'core/service/data/emFactory'
import * as IPersonExt from "core/config/entityExtension/person"

export default class EcUserRepo extends IUtilityRepo
{
    static serviceId = 'data.user';
    static $inject = ['$http', ICommon.serviceId, IEntityFactory.serviceId,'userStatic'];
    activated = false;
    private entityExtCfgs: Array<ecat.entity.IEntityExtension> = [IPersonExt.personConfig];
    isLoaded = this.areItemsLoaded;
    logSuccess = this.c.logSuccess('User Data Service');
    logWarn = this.c.logWarning('User Data Service');
    manager: breeze.EntityManager;
    persona: ecat.entity.IPerson;
    private query: breeze.EntityQuery;
    private qf = (error) => this.queryFailed('User Data Service', error);
    rname: ecat.IAllApiResources;
    token = {
        userEmail: '',
        password: '',
        auth: '',
        warning: new Date(),
        expire: new Date(),
        validatity(): IAppVar.TokenStatus {
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
    userPriKey: number;


    constructor(private $http: angular.IHttpService,
        private c: ICommon, emFactory: IEntityFactory,
        private userStatic: ecat.entity.ILoginToken) {

        super(c);

        this.manager = emFactory.getNewManager(c.appVar.EcMapApiResource.user, this.entityExtCfgs);
        this.query = new breeze.EntityQuery();
        this.rname = c.resourceNames;
        if (userStatic) {
            this.token.auth = userStatic.authToken;
            this.token.expire = new Date(userStatic.tokenExpire as any);
            this.token.warning = new Date(userStatic.tokenExpireWarning as any);
        }
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
            url: `${this.c.appEndpoint + this.rname.user.endPointName}/${this.rname.user.checkEmail.resourceName}`,
            params: { email: email }
        }

        function emailIsUniqueResponse(result: angular.IHttpPromiseCallbackArg<boolean>) {
            return result.data;
        }

        return this.$http(requestCfg)
            .then(emailIsUniqueResponse)
            .catch(this.qf);
    }

    getUserProfile(): breeze.promises.IPromise<any> {
        const self = this;

        const resource = this.rname.user.profile.resourceName;
        if (this.isLoaded.userProfile) {
            const pred = new breeze.Predicate('personId', breeze.FilterQueryOp.Equals, this.persona.personId);
            return this.c.$q.when(this.queryLocal(this.manager, resource, null, pred));
        }

        return this.query.from(resource)
            .using(this.manager)
            .execute()
            .then(getUserProfileResponse)
            .catch(this.qf);

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
        const isAuthorized = authorizedRoles.some((role) => this.persona.mpInstituteRole === role);
        const deferred = this.c.$q.defer();
        const coreStates = new ICoreStates;
        if (!isAuthorized) {
            const routingError: ecat.IRoutingError = {
                errorCode: this.c.appVar.SysErrorType.NotAuthorized,
                message: 'You do not have the appropriate authorization level to access that resources',
                redirectTo: coreStates.dashboard.name
            }
            deferred.reject(routingError);
        }

        deferred.resolve();

        return deferred.promise;
    }

    loadManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        if (!this.manager.metadataStore.isEmpty()) {
            return this.c.$q.when(true);
        }

        return this.manager.fetchMetadata()
            .then(() => {
                if (this.userStatic) {
                    this.createUserToken();
                }
            })
            .catch(this.qf);
    }

    loginUser(userEmail: string, password: string, saveLogin: boolean): breeze.promises.IPromise<ecat.entity.IPerson | angular.IPromise<void>> {
        if (this.token && userEmail === this.token.userEmail && password === this.token.password && this.token.validatity() === this.c.appVar.TokenStatus.Valid) {
            return this.c.$q.resolve(this.persona);
        }

        this.logoutUser();
        
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
            .catch(this.qf);

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

    logoutUser(): void {
        this.persona = null;
        this.manager.clear();
        this.token.auth = null;
        this.token.warning = null;
        this.token.expire = null;
        this.token.userEmail = null;
        this.token.password = null;
        this.userStatic = null;
        localStorage.removeItem('ECAT:TOKEN');
        sessionStorage.removeItem('ECAT:TOKEN');
        this.areItemsLoaded.userToken = false;
    }

    saveUserChanges(): breeze.promises.IPromise<breeze.SaveResult> { return this.saveChanges(this.manager); }  
}


