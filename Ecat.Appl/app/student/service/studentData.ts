import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'

interface StudentApiResources extends ecat.IApiResources {
    getCourses: ecat.IApiResource,
    getAllGroupData: ecat.IApiResource;
}

export default class EcStudentRepo extends IUtilityRepo {
    static serviceId = 'data.student';
    static $inject = ['$injector'];

    activated = false;
    activeCourse: ecat.entity.ICourseMember;
    private studentApiResources: StudentApiResources = {
        getCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.unk,
            resource: {
                name: 'GetCourses',
                isLoaded: false
            }
        },
        getAllGroupData: {
            returnedEntityType: this.c.appVar.EcMapEntityType.unk,
            resource: {
                name: 'GetAllGroupData',
                isLoaded: false
            }
        }
    };

    constructor(inj) {
        super(inj, 'Student Data Service', AppVar.EcMapApiResource.student, []);
        this.loadManager(this.apiResources);
    }

    getCourses(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.apiResources.getCourses.resourceName;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getCoursesResponse)
            .catch(this.queryFailed);

        function getCoursesResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got course memberships', retData.results, false);
                return retData.results as ecat.entity.ICourseMember[];
            }
        }
    }

    getAllGroupData(courseMem: Ecat.Models.EcCourseMember): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.apiResources.getAllGroupData.resourceName;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getGroupDataResponse)
            .catch(this.queryFailed);

        function getGroupDataResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                //self.isLoaded.studentAssessment = true;
                logger('Got group and assessment data', retData.results, false);
                return retData.results as ecat.entity.IGroupMember[];
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