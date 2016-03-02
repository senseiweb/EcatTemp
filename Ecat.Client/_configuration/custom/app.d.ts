declare var mCustomScroll: any;
declare var Waves: any;
declare var moduleCfg: any;
declare var uiSelect: any;

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

declare module 'moduleCfg' {
    export = moduleCfg;
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


    interface IEcatStateClass {
        parentName: string;
    }

    interface IEcRootScope extends angular.IRootScopeService {
        $state: angular.ui.IStateService;
        stateMgr: any;
        startUpComplete: boolean;
    }    

    interface IQueryError {
        errorType: number;
        errorMessage: string;  
    }

    interface IModuleAppCfg extends angular.IServiceProvider {
        coreApp: ICoreAppConfig;
    }

    interface ICoreAppConfig extends IEcatAppConfig {
        events: {
            spInvntoryResponseChanged?: string;
            saveChangesEvent?: string;
            managerLoaded?: string;
            managerCreated?: string;
            addManager?: string;
        }
    }

    interface IEcatAppConfig {
        name: string;
        errorPrefix: string;
        version: number;
        events: any;
    }

    interface ILocalStorageKeys
    {
        userId: string;
        appServer: string;
        clientProfile: string;
    }

   
    interface IStudEvents {

    }

    interface IFacilitatorEvents {
    }

    interface ICourseAdminEvents {

    }

    interface IDesignerEvents {

    }

    interface IEcStateObject {
        [name: string]: angular.ui.IState;
    }

    interface IRoutingError {
        message: string;
        errorCode: number;
        redirectTo: string;
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

    interface IStudentApiResources {
        endPointName?: string;
    }

   
    export interface IApiResource {
        resource: string;
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

    //interface IAssesseeComposite {
    //    groupMember: Ecat.Shared.Model.MemberInGroup;
    //    hEReceived: number;
    //    eReceived: number;
    //    nDReceived: number;
    //    iEReceived: number;
    //    overall: number;
    //}

    //interface IInventoryWithOveralls {
    //    inventory: Ecat.Shared.Model.SpInventory;
    //    self: string;
    //    peerAggregate: number;
    //    peerOverall: string;
    //    fac: string;
    //}

    //interface IStudentSpStatus {
    //    groupMember: Ecat.Shared.Model.MemberInGroup;
    //    selfComplete: boolean;
    //    peersComplete: number;
    //    stratsComplete: number;
    //    assessorComposite: IAssessorComposite;
    //}

    interface IAssessorComposite {
        hEGiven: number;
        eGiven: number;
        nDGiven: number;
        iEGiven: number;
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