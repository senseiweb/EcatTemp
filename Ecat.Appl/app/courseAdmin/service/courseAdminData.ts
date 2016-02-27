import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'

interface ICourseAdminApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource,
    pollCourses: ecat.IApiResource,
    pollCourseMembers: ecat.IApiResource,
    pollGroups: ecat.IApiResource
    pollGroupMembers: ecat.IApiResource
}

export default class EcCourseAdminRepo extends IUtilityRepo {
    static serviceId = 'data.courseAdmin';
    static $inject = ['$injector'];

    activated = false;
    academy: ecat.entity.IAcademy;
    selectedCourse: ecat.entity.ICourse;
    courses: ecat.entity.ICourse[] = [];

    private crseAdminApiResources: ICourseAdminApiResources = {
        initCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.course,
            resource: {
                name: 'GetCourses',
                isLoaded: false
            }
        },
        pollCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.course,
            resource: {
                name: 'PollCourses',
                isLoaded: false
            }
        },
        pollCourseMembers: {
            returnedEntityType: this.c.appVar.EcMapEntityType.course,
            resource: {
                name: 'PollCourseMembers',
                isLoaded: false
            }
        },
        pollGroups: {
            returnedEntityType: this.c.appVar.EcMapEntityType.group,
            resource: {
                name: 'PollGroups',
                isLoaded: false
            }
        },
        pollGroupMembers: {
            returnedEntityType: this.c.appVar.EcMapEntityType.group,
            resource: {
                name: 'PollGroupMembers',
                isLoaded: false
            }
        },
    };

    constructor(inj) {
        super(inj, 'Course Admin Data Service', AppVar.EcMapApiResource.courseAdmin, []);
        this.loadManager(this.crseAdminApiResources);
    }

    initializeCourses(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const api = this.crseAdminApiResources;
        const self = this;

        if (api.initCourses.resource.isLoaded && !forceRefresh) {
            const courseMems = this.queryLocal(api.initCourses.resource.name) as Array<ecat.entity.ICourse>;
            this.logSuccess('Courses loaded from local cache', courseMems, false);
            return this.c.$q.when(courseMems);
        }

        return this.query.from(api.initCourses.resource.name)
            .using(this.manager)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
            const courses = data.results as Array<ecat.entity.ICourse>;
            self.logSuccess('Courses loaded from remote store', courses, false);
            return courses;
        }
    }

    pollCourses(): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const api = this.crseAdminApiResources;
        const self = this;

        return this.query.from(api.pollCourses.resource.name)
            .using(this.manager)
            .execute()
            .then(pollCoursesReponse)
            .catch(this.queryFailed);

        function pollCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
            const courses = data.results as Array<ecat.entity.ICourse>;
            self.logSuccess('Courses loaded from remote store', courses, false);
            return courses;
        }
    }

    pollCourseMembers(): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
        const api = this.crseAdminApiResources;
        const self = this;

        return this.query.from(api.pollCourseMembers.resource.name)
            .using(this.manager)
            .execute()
            .then(pollCourseMemsReponse)
            .catch(this.queryFailed);

        function pollCourseMemsReponse(data: breeze.QueryResult): ecat.entity.ICourse {
            const course = data.results[0] as ecat.entity.ICourse;
            self.logSuccess('Courses loaded from remote store', course, false);
            return course;
        }
    }

    pollGroups(): breeze.promises.IPromise<Array<ecat.entity.IWorkGroup> | angular.IPromise<void>> {
        const api = this.crseAdminApiResources;
        const self = this;

        return this.query.from(api.pollGroups.resource.name)
            .using(this.manager)
            .execute()
            .then(pollGroupsReponse)
            .catch(this.queryFailed);

        function pollGroupsReponse(data: breeze.QueryResult): Array<ecat.entity.IWorkGroup> {
            const groups = data.results as Array<ecat.entity.IWorkGroup>;
            self.logSuccess('Courses loaded from remote store', groups, false);
            return groups;
        }
    }

    pollGroupMembers(): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
        const api = this.crseAdminApiResources;
        const self = this;

        return this.query.from(api.pollCourses.resource.name)
            .using(this.manager)
            .execute()
            .then(pollGroupMembersReponse)
            .catch(this.queryFailed);

        function pollGroupMembersReponse(data: breeze.QueryResult): ecat.entity.IWorkGroup {
            const group = data.results[0] as ecat.entity.IWorkGroup;
            self.logSuccess('Courses loaded from remote store', group, false);
            return group;
        }
    }
}