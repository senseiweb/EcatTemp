import IUtilityRepo from 'core/service/data/utility'
import * as AppVar from 'appVars'
import ICommon from 'core/service/common'
import ICoreStates from "core/config/states/core"
import moment from 'moment'

export default class EcUserRepo
{
    static serviceId = 'data.user';
    static $inject = ['$http', IUtilityRepo.serviceId, ICommon.serviceId, 'userStatic'];
    activated = false;
    $q: angular.IQService;
    private _isLoggedIn = false;
    userPriKey: number;
    bbUserId: string;
    isLoaded = this.utilityRepo.areItemsLoaded;
    manager: breeze.EntityManager;
    person: ecat.entity.IPerson;
    query: breeze.EntityQuery;
    rname: ecat.IAllApiResources;
    logSuccess = this.common.logger.getLogFn('User Repo', AppVar.EcMapAlertType.success);
    logWarn = this.common.logger.getLogFn('User Repo', AppVar.EcMapAlertType.success);
    logError = this.common.logger.getLogFn('User Repo', AppVar.EcMapAlertType.danger);
    token = {
        userEmail: '',
        password: '',
        auth: '',
        warning: new Date(),
        expire: new Date(),
        validatity(): AppVar.TokenStatus {
            if (!this.auth || !this.expire) {
                return AppVar.TokenStatus.Missing;
            }
            const now = new Date();
            if (this.expire < now) {
                return AppVar.TokenStatus.Expired;
            }
            return AppVar.TokenStatus.Valid;
        }
    };
    persona: ecat.entity.IPerson;

    constructor(private $http: angular.IHttpService, private utilityRepo: IUtilityRepo, private common: ICommon, private userStatic: ecat.entity.ILoginToken ) {
        this.manager = utilityRepo.userManager;
        this.query = new breeze.EntityQuery();
        this.rname = common.resourceNames;
        this.$q = common.$q;
        if (userStatic) {
            this.token.auth = userStatic.authToken;
            this.token.expire = new Date(userStatic.tokenExpire as any);
            this.token.warning = new Date(userStatic.tokenExpireWarning as any);
        }
    }

    createUserLocal(addSecurity: boolean): ecat.entity.IPerson {

         const newPerson = {
             isRegistrationComplete: false,
             mpInstituteRole: AppVar.EcMapInstituteRole.external,
         };

         const user = this.manager.createEntity(AppVar.EcMapEntityType.person, newPerson) as ecat.entity.IPerson;

         user.mpMilAffiliation = AppVar.EcMapAffiliation.unk;
         user.mpMilComponent = AppVar.EcMapComponent.unk;
         user.mpMilPaygrade = AppVar.EcMapPaygrade.unk;
         user.mpGender = AppVar.EcMapGender.unk;

         if (addSecurity) {
             user.security = this.manager.createEntity(AppVar.EcMapEntityType.security, { personId: user.personId }) as ecat.entity.ISecurity;
         }

         return user;
    }

    createUserToken(): ecat.entity.ILoginToken {

        this.persona = this.manager.createEntity(AppVar.EcMapEntityType.person, this.userStatic.person, breeze.EntityState.Unchanged) as ecat.entity.IPerson;

        const newToken = {
            personId: this.persona.personId,
            person: this.persona,
            tokenExpire: this.userStatic.tokenExpire,
            tokenExpireWarning: this.userStatic.tokenExpireWarning,
            authToken: this.userStatic.authToken,
        } as ecat.entity.ILoginToken;

        const token = this.manager.createEntity(AppVar.EcMapEntityType.loginTk,
            newToken, breeze.EntityState.Unchanged) as ecat.entity.ILoginToken;

        this.token.expire = token.tokenExpire;
        this.token.auth = token.authToken;
        this.token.warning = token.tokenExpireWarning;

        return token;
    }

    emailIsUnique(email: string): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        const requestCfg: angular.IRequestConfig = {
            method: 'get',
            url: `${this.common.appEndpoint + this.rname.user.endPointName}/${this.rname.user.checkEmail.resourceName}`,
            params: { email: email }
        }

        function emailIsUniqueResponse(result: angular.IHttpPromiseCallbackArg<boolean>) {
            return result.data;
        }

        return this.$http(requestCfg)
            .then(emailIsUniqueResponse)
            .catch(this.utilityRepo.queryFailed);
    }

    getUserProfile(): breeze.promises.IPromise<any> {
        const self = this;

        const resource = this.rname.user.profile.resourceName;
        if (this.isLoaded.userProfile) {
            const pred = new breeze.Predicate('personId', breeze.FilterQueryOp.Equals, this.persona.personId);
            return this.$q.when(this.utilityRepo.queryLocal(this.manager, resource, null, pred));
        }

        return this.query.from(resource)
            .using(this.manager)
            .execute()
            .then(getUserProfileResponse)
            .catch(this.utilityRepo.queryFailed);

        function getUserProfileResponse(userProfileResult: breeze.QueryResult) {
            const userProfile = userProfileResult.results[0];
            if (userProfile) {
                return userProfile;
            }

            const profile = { personId: self.persona.personId }

            switch (self.persona.mpInstituteRole) {
                case AppVar.EcMapInstituteRole.student:
                    return self.manager.createEntity(AppVar.EcMapEntityType.studProfile, profile);
                case AppVar.EcMapInstituteRole.facilitator:
                    return self.manager.createEntity(AppVar.EcMapEntityType.facProfile, profile);
                case AppVar.EcMapInstituteRole.external:
                    return self.manager.createEntity(AppVar.EcMapEntityType.externalProfile, profile);
                default:
                    return null;
            }
        }
    }

    isAuthorized(authorizedRoles: Array<string>): angular.IPromise<any> {
        const isAuthorized = authorizedRoles.some((role) => this.persona.mpInstituteRole === role);
        const deferred = this.$q.defer();
        const coreStates = new ICoreStates;
        if (!isAuthorized) {
            const routingError: ecat.IRoutingError = {
                errorCode: AppVar.SysErrorType.NotAuthorized,
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
            return this.$q.when(true);
        }

        return this.manager.fetchMetadata()
            .then(() => {
                if (this.userStatic) {
                    this.persona = this.manager.createEntity(AppVar.EcMapEntityType.person, this.userStatic.person) as ecat.entity.IPerson;
                }
            })
            .catch(this.utilityRepo.queryFailed);
    }

    loginUser(userEmail: string, password: string, saveLogin: boolean): breeze.promises.IPromise<ecat.entity.IPerson | angular.IPromise<void>> {
        if (this.token && userEmail === this.token.userEmail && password === this.token.password && this.token.validatity() === AppVar.TokenStatus.Valid) {
            return this.$q.resolve(this.persona);
        }

        this.logoutUser();
        
        const self = this;
        const requestCfg: angular.IRequestConfig = {
            method: 'POST',
            url: `${this.common.serverEnvironment}/token`,
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
            .catch(this.utilityRepo.queryFailed);

        function loginUserResponse(result: angular.IHttpPromiseCallbackArg<any>) {
            const token = JSON.parse(result.data.loginToken) as ecat.entity.ILoginToken;
            const user = angular.copy(token.person);

            self.persona = self.manager.createEntity(AppVar.EcMapEntityType.person, user, breeze.EntityState.Unchanged, breeze.MergeStrategy.PreserveChanges) as ecat.entity.IPerson;

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
        this.utilityRepo.areItemsLoaded.userToken = false;
    }

    saveUserChanges(): breeze.promises.IPromise<breeze.SaveResult> { return this.utilityRepo.saveChanges(this.manager); }  
}


