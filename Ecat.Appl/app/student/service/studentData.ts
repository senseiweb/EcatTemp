import IUtilityRepo from "core/service/data/utility"
import * as appVar from "appVars"

interface ISysStudentApiResouces extends ecat.IApiResources {

}

interface ILocalSysStudentResources {
    
}

export default class EcStudentDataService extends IUtilityRepo {
    static serviceId = 'data.student';
    static $inject = ['$injector'];
    
    private apiResources: ISysStudentApiResouces = {

    };


    constructor(inj) {
        super(inj, 'Student DataService', appVar.EcMapApiResource.sa, []);
        this.loadManager(this.apiResources);
    }


    loadStudentManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.apiResources)
            .then(() => {
                this.registerTypes(this.apiResources);
            })
            .catch(this.queryFailed);
        
    }
}