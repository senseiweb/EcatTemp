import IUtilityRepo from 'core/service/data/utility'
import * as AppVar from 'appVars'

interface StudentApiResources extends ecat.IApiResources {
    getAssessments: ecat.IApiResource;
}

export default class EcStudentRepo extends IUtilityRepo
{
    static serviceId = 'data.student';
    static $inject = ['$injector'];

    private apiResources: StudentApiResources = {
        getAssessments: {
            returnedEntityType: this.c.appVar.EcMapEntityType.unk,
            resourceName: 'GetMembershipsAndAssessments'
        }
    };

    activated = false;
    isLoaded = this.c.areItemsLoaded;

    constructor(inj) {
        super(inj, 'Student Data Service', AppVar.EcMapApiResource.student, []);
        this.loadManager(this.apiResources);
    }

    getMembershipsAndAssessments(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.apiResources.getAssessments.resourceName;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getAssessmentsResponse)
            .catch(this.queryFailed);

        function getAssessmentsResponse(retData: breeze.QueryResult) {
            if (retData) {
                self.isLoaded.studentAssessment = true;
                logger('Got Assessment Data', retData.results, false);
                return retData.results as ecat.entity.ICourseMember[];
            }

        }
    }

    loadStudentManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.apiResources)
            .then(() => {
                this.registerTypes(this.apiResources);
            })
            .catch(this.queryFailed);
    }
}