import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'

interface CourseAdminApiResources extends ecat.IApiResources {
    getCourses: ecat.IApiResource,
    getGroups: ecat.IApiResource;
}

export default class EcCourseAdminRepo extends IUtilityRepo {
    static serviceId = 'data.courseAdmin';
    static $inject = ['$injector'];

    activated = false;
    academy: ecat.entity.IAcademy;
    selectedCourse: ecat.entity.ICourse;
    courses: ecat.entity.ICourse[] = [];

    private CourseAdminApiResources: CourseAdminApiResources = {
        getCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.course,
            resource: {
                name: 'GetCourses',
                isLoaded: false
            }
        },
        getGroups: {
            returnedEntityType: this.c.appVar.EcMapEntityType.group,
            resource: {
                name: 'GetGroups',
                isLoaded: false
            }
        }
    };

    constructor(inj) {
        super(inj, 'Course Admin Data Service', AppVar.EcMapApiResource.courseAdmin, []);
        this.loadManager(this.CourseAdminApiResources);
    }

    getCourses(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.CourseAdminApiResources.getCourses.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getCoursesResponse)
            .catch(this.queryFailed);

        function getCoursesResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got courses', retData.results, false);
                self.CourseAdminApiResources.getCourses.resource.isLoaded = true;
                return retData.results as ecat.entity.ICourse[];
            }
        }
    }

    getGroups(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.CourseAdminApiResources.getGroups.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getGroupResponse)
            .catch(this.queryFailed);

        function getGroupResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got groups', retData.results, false);
                self.CourseAdminApiResources.getGroups.resource.isLoaded = true;
                return retData.results as ecat.entity.IGroup[];
            }
        }
    }

    loadCourseAdminManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.CourseAdminApiResources)
            .then(() => {
                this.registerTypes(this.CourseAdminApiResources);
            })
            .catch(this.queryFailed);
    }
}