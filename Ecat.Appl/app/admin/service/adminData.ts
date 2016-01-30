import IUtilityRepo from "core/service/data/utility"
import IDataCtx from "core/service/data/context"
import ICommon from "core/service/common"
import IEmFactory from "core/service/data/emFactory"


interface ISysAdminApiResouces extends ecat.IApiResources {
    
}

interface ILocalSysAdminResources {
    
}

export default class EcSysAdminDataService extends IUtilityRepo {
    static serviceId = 'data.sysAdmin';
    static $inject = [ICommon.serviceId, IEmFactory.serviceId, IDataCtx.serviceId];
    
    private apiResources: ISysAdminApiResouces =  {};
    private isLoaded;

    constructor(c: ICommon, emf, dCtx) {
        super(c, emf, dCtx, 'System Admin DataService', c.appVar.EcMapApiResource.sa, []);
    }

}