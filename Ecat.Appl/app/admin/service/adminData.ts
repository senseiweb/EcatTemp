import IUtilityRepo from "core/service/data/utility"

export default class EcSysAdminDataService extends IUtilityRepo {
    static serviceId = 'data.sysAdmin';
    static $inject = ['$injector'];
    
    manager: breeze.EntityManager;

    constructor(private $inj: angular.auto.IInjectorService) {
        super($inj);
        this.manager = this.getManager(this.appVars.EcMapApiResource.sa, null);
    }




}