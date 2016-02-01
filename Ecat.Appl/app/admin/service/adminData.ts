import IUtilityRepo from "core/service/data/utility"
import * as appVar from "appVars"

interface ISysAdminApiResouces extends ecat.IApiResources {
    acad: ecat.IApiResource;
    acadCat: ecat.IApiResource;
}

interface ILocalSysAdminResources {
    
}

export default class EcSysAdminDataService extends IUtilityRepo {
    static serviceId = 'data.sysAdmin';
    static $inject = ['$injector'];
    
    private apiResources: ISysAdminApiResouces = {
        acad: {
            resourceName: 'Academies',
            returnedEntityType: appVar.EcMapEntityType.academy
        },
        acadCat: {
            resourceName: 'AcademyCategories',
            returnedEntityType: appVar.EcMapEntityType.unk
        }
    };
    private academyCategoryList: Array<Ecat.Models.AcademyCategory> = [];
    private isLoaded;

    constructor(inj) {
        super(inj, 'System Admin DataService', appVar.EcMapApiResource.sa, []);
        this.loadManager(this.apiResources);
    }

    createAcademyLocal(): ecat.entity.IAcademy {
        return this.manager.createEntity(this.c.appVar.EcMapEntityType.academy) as ecat.entity.IAcademy;
    }

    getAcademies(): breeze.promises.IPromise<Array<ecat.entity.IAcademy> | angular.IPromise<any>> {
        const res = this.apiResources.acad.resourceName;
        const common = this.c;
        const logger = this.logInfo;

        if (this.c.areItemsLoaded.academy) {
            const academies = this.queryLocal(res) as Array<ecat.entity.IAcademy>;
            return this.c.$q.when(academies);
        }

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getAcademiesResponse)
            .catch(this.queryFailed);

            function getAcademiesResponse(data: breeze.QueryResult): Array<ecat.entity.IAcademy> {
                if (data.results.length > 0) {
                    common.areItemsLoaded.academy = true;
                    logger('Retrieved academy list from remote store', data.results, false);
                    return data.results as Array<ecat.entity.IAcademy>;
                }

                logger('The query succeeded, but no items where retrieved', data, false);
            }
    }

    getCategoryList(): breeze.promises.IPromise<Array<Ecat.Models.AcademyCategory> | angular.IPromise<any>> {
        const self = this;

        if (this.academyCategoryList.length > 0) {
            return this.c.$q.when(this.academyCategoryList);
        }

        return this.query.from(this.apiResources.acadCat.resourceName)
            .using(this.manager)
            .execute()
            .then(categoryListRepsonse)
            .catch(this.queryFailed);
        
            function categoryListRepsonse(data: breeze.QueryResult) {
                self.academyCategoryList = data.results as any;
            }
    }

    loadAdminManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.apiResources)
            .then(() => {
                this.registerTypes(this.apiResources);
            })
            .catch(this.queryFailed);
    }
}