import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'

interface IStudentApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource;
    getCourse: ecat.IApiResource;
    getGroup: ecat.IApiResource;
}

export default class EcStudentRepo extends IUtilityRepo {
    static serviceId = 'data.student';
    static $inject = ['$injector'];

    activated = false;
    activeCourse: ecat.entity.ICourseMember;
    private studentApiResources: IStudentApiResources = {
        initCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetCourses',
                isLoaded: false
            }
        },
        getCourse: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetCourses',
                isLoaded: {
                    course: {} as any
                }
            }
        },
        getGroup: {
            returnedEntityType: this.c.appVar.EcMapEntityType.grpMember,
            resource: {
                name: 'GetAllGroupData',
                isLoaded: {
                    group: {} as any
                }
            }
        }
    };

    constructor(inj) {
        super(inj, 'Student Data Service', AppVar.EcMapApiResource.student, []);
        this.loadManager(this.studentApiResources);
    }

    initCourses(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const api = this.studentApiResources;
        const self = this;
        let courses: Array<ecat.entity.ICourse> = [];

        if (api.initCourses.resource.isLoaded && !forceRefresh) {
            const courseMems = this.queryLocal(api.initCourses.resource.name) as Array<ecat.entity.ICourseMember>;
            courses = courseMems.map(cm => cm.course);
            this.logSuccess('Courses loaded from local cache', courses, false);

            return this.c.$q.when(courses);
        }

        return this.query.from(api.initCourses.resource.name)
            .using(this.manager)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

            function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
                const crseMems = data.results as Array<ecat.entity.ICourseMember>;
                crseMems.forEach(crseMem => {
                    courses.push(crseMem.course);
                    api.getCourse.resource.isLoaded[crseMem.courseId] = true;
                });
                self.logSuccess('Courses loaded from remote store', courses, false);
                return courses;
            }
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