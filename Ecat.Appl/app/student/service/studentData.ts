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
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetCourses',
                isLoaded: false
            }
        },
        getAllGroupData: {
            returnedEntityType: this.c.appVar.EcMapEntityType.grpMember,
            resource: {
                name: 'GetAllGroupData',
                isLoaded: false
            }
        }
    };

    constructor(inj) {
        super(inj, 'Student Data Service', AppVar.EcMapApiResource.student, []);
        this.loadManager(this.studentApiResources);
    }

    getCourses(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.studentApiResources.getCourses.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getCoursesResponse)
            .catch(this.queryFailed);

        function getCoursesResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got course memberships', retData.results, false);
                self.studentApiResources.getCourses.resource.isLoaded = true;
                return retData.results as ecat.entity.ICourseMember[];
            }
        }
    }

    getAllGroupData(courseMem: Ecat.Shared.Model.MemberInCourse): breeze.promises.IPromise<any> {

        const self = this;
        const res = this.studentApiResources.getAllGroupData.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getGroupDataResponse)
            .catch(this.queryFailed);

        function getGroupDataResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got group and assessment data', retData.results, false);
                self.studentApiResources.getAllGroupData.resource.isLoaded = true;
                return retData.results as ecat.entity.IGroupMember[];
            }
        }
    }

    loadStudentManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.studentApiResources)
            .then(() => {
                this.registerTypes(this.studentApiResources);
            })
            .catch(this.queryFailed);
    }
}