declare var mCustomScroll: any;
declare var Waves: any;
declare var systemCfg: any;

interface JQuery {
    mCustomScrollbar({}: any): JQuery;
    placeholder({}: any): JQuery;
    mask(mask: any): JQuery;
}

declare module breeze {
    var saveErrorMessageService: any;
}

interface IHttpRequestConfigHeaders {
    Authorization: string;
}

declare module 'mCustomScroll' {
    export = mCustomScroll;
}

declare module 'systemCfg' {
    export = systemCfg;
}

declare module ecat {

    interface ILocalToken {
        userEmail: string;
        password: string;
        auth: string;
        warning: Date;
        expire: Date;
        validity(): number;
    }

    interface IEcRootScope extends angular.IRootScopeService {
        $state: angular.ui.IStateService;
        stateMgr: any;
    }    

    interface ICoreCfg {
        errorPrefix?: string;
        coreEvents: IGlobalEvents;
    }

    interface ILocalStorageKeys
    {
        userId: string;
        appServer: string;
        clientProfile: string;
    }

    interface IGlobalEvents
    {
        saveChangesEvent?: string;
        managerLoaded?: string;
    }

    interface IEcStateObject {
        [name: string]: angular.ui.IState;
    }

    interface IRoutingError {
        message: string;
        errorCode: number;
        redirectTo: angular.ui.IState;
        params?: {};
    }

    interface SigEvent {
        eventType: string;
        eventTimeStamp: moment.Moment;
        event: string;
        source: string;    
    }

    interface IApiResources {
        [name: string]: IApiResource;
    }

    //interface IUserApiResources {
    //    endPointName?: string;
    //    regUser: IApiResource;
    //    login: IApiResource;
    //    resetPin: IApiResource;
    //    fetch: IApiResource;
    //    profile: IApiResource;
    //    checkEmail: IApiResource;
    //}

    //interface IFacilitatorApiResources {
    //    endPointName?: string;
    //}

   
    export interface IApiResource {
        resourceName: string;
        returnedEntityType: string;
    }

 
    interface IEcatStateService extends angular.ui.IStateService {
        params: IEcatParams;
    }

    interface IEcatParams extends angular.ui.IStateParamsService {
        ltiModId: string;
        uId: string;
        mode: string;
    }

    interface IUserLogStatus {
        isLoggedIn: boolean;
        hasToken: boolean;
        tokenWarnDate: Date;
        tokenExpireDate: Date;
    }

    
}

declare module ecat.local
{
    interface IEcatClientEnviroment {
        credentials: {
            userName: string;
            tokenExpire: Date;
            token: string;
        }
        meta: {
            refreshDate: Date;
            userMgr: string;
            primaryMgr: string;
        }
    }

    interface IMilAffil {
        usaf: string;
        usa: string;
        uscg: string;
        usn: string;
        usmc: string;
        fn: string;
        none: string;
    }

    interface IMilComponent
    {
        active: string;
        reserve: string;
        guard: string;
        none: string;
    }

    interface IMilPayGrade
    {
        civ: {designator: string};
        fn: { designator: string };
        e1: IMilRank;
        e2: IMilRank;
        e3: IMilRank;
        e4: IMilRank;
        e5: IMilRank;
        e6: IMilRank;
        e7: IMilRank;
        e8: IMilRank;
        e9: IMilRank;

    }

    interface IMilRank
    {
        designator: string,
        usaf: IMilServiceRank,
        usa: IMilServiceRank,
        usn: IMilServiceRank,
        usmc: IMilServiceRank,

    }

    interface IMilServiceRank
    {
        rankShortName: string;
        rankLongName: string;
    }
}