import IUtilityRepo from 'core/service/data/utility'
import ICommon from "core/common/commonService"
import IEmFactory from "core/service/data/emfactory"
import * as _mp from "core/common/mapStrings"

export default class EcFacultyAdminContext extends IUtilityRepo{
    static serviceId = 'data.lmsAdmin';
    static $inject = ['$injector'];
    isLoaded = {
        allCourses: false,
        allCourseMembers: {},
        allWorkGroups: {},
        allGroupMembers: {},
        courseRecon: false,
        memRecon: {},
        grpMemRecon: { },
        grpRecon: {}
    }
    private loadedKeys = {
        courseRecon: null,
        memRecon: null,
        grpMemRecon: {},
        grpRecon: {}
    }

    private apiBase = this.c.appEndpoint + 'LmsAdmin/';

    private apis = {
        allCourses: 'GetAllCourses',
        pollCourses: 'PollCourses',
        allCourseMembers: 'GetAllCourseMembers',
        pollCourseMembers: 'PollCourseMembers',
        allGroups: 'GetAllGroups',
        pollGroups: 'PollGroups',
        allGroupMembers: 'GetGroupMembers',
        pollGroupMembers: 'PollGroupMembers',
        pollGroupCategory: 'PollGroupCategory',
        syncGrades: 'SyncBbGrades'
    }

    isActivated = false;

    constructor(inj) {
        super(inj, 'Fac Admin Data Service', _mp.MpApiResource.facAdmin, null);
    }

    activate(): angular.IPromise<any> {
        if (this.isActivated) {
            return this.c.$q.resolve();
        }

        return this.getManager(this.emf)
            .then(() => {
                this.isActivated = true;
            });
    }

    fetchAllCourses(forcedRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const that = this;

        let courses: Array<ecat.entity.ICourse>;

        if (this.isLoaded.allCourses && forcedRefresh) {
            courses = this.manager.getEntities(_mp.MpEntityType.course) as Array<ecat.entity.ICourse>;
            if (courses) {
                this.log.success('Retrieved All Courses from local cache', courses, false);
                return this.c.$q.when(courses);
            }
        }

        return this.query.from(this.apis.allCourses)
            .using(this.manager)
            .execute()
            .then(fetchAllCoursesResponse)
            .catch(this.queryFailed);

            function fetchAllCoursesResponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
                courses = data.results as Array<ecat.entity.ICourse>;
                
                if (courses && courses.length > 0) {
                    that.isLoaded.allCourses = true;
                    that.log.success('Retrieved All Courses from remote cache', courses, false);
                }

                return courses;
            }
    }

    fetchAllCourseMembers(courseId: number, forcedRefresh?: boolean): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
        const that = this;

        let course: ecat.entity.ICourse;

        if (this.isLoaded.allCourseMembers[courseId] && forcedRefresh) {
            course = this.manager.getEntityByKey(_mp.MpEntityType.course, courseId) as ecat.entity.ICourse;

            if (course.faculty.length > 0 || course.students.length > 0) {
                this.log.success('Retrieved All Course Members from local cache', course, false);
                return this.c.$q.when(course);
            }
        }

        return this.query.from(this.apis.allCourseMembers)
            .using(this.manager)
            .withParameters({courseId:courseId})
            .execute()
            .then(fetchAllCourseMemberResponse)
            .catch(this.queryFailed);

        function fetchAllCourseMemberResponse(data: breeze.QueryResult): ecat.entity.ICourse {
            course = data.results[0] as ecat.entity.ICourse;

            if ((course.faculty && course.faculty.length > 0) || (course.students && course.students.length > 0)) {
                that.isLoaded.allCourseMembers[courseId] = true;
                that.log.success('Retrieved All Course Members from remote cache', course, false);
            }

            return course;
        }
    }

    fetchAllGroups(courseId: number, forcedRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.IWorkGroup> | angular.IPromise<void>> {
        const that = this;

        let workGroups: Array<ecat.entity.IWorkGroup>;

        if (this.isLoaded.allWorkGroups[courseId] && !forcedRefresh) {
            const parentCourse = this.manager.getEntityByKey(_mp.MpEntityType.course, courseId) as ecat.entity.ICourse;
            workGroups = parentCourse.workGroups;
            if (workGroups) {
                this.log.success('Retrieved All WorkGroups from local cache', workGroups, false);
                return this.c.$q.when(workGroups);
            }
        }

        return this.query.from(this.apis.allGroups)
            .withParameters({courseId: courseId})
            .using(this.manager)
            .execute()
            .then(fetchAllGroupsResponse)
            .catch(this.queryFailed);

        function fetchAllGroupsResponse(data: breeze.QueryResult): Array<ecat.entity.IWorkGroup> {
            const parentCourse = data.results[0] as ecat.entity.ICourse;

            workGroups = parentCourse.workGroups;

            if (workGroups && workGroups.length > 0) {
                that.isLoaded.allWorkGroups[parentCourse.id] = true;
                that.log.success('Retrieved All WorkGroups from remote cache', workGroups, false);
            }

            return workGroups;
        }
    }

    fetchAllGroupMembers(workGroupId, forcedRefresh?: boolean): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
        const that = this;

        let workGroup: ecat.entity.IWorkGroup;

        if (this.isLoaded.allGroupMembers[workGroupId] && !forcedRefresh) {
             workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, workGroupId) as ecat.entity.IWorkGroup;
             if (workGroup) {
                 this.log.success('Retrieved WorkGroup with Members from local cache', workGroup, false);
                 return this.c.$q.when(workGroup);
            }
        }

        return this.query.from(this.apis.allGroupMembers)
            .withParameters({ workGroupId: workGroupId })
            .using(this.manager)
            .execute()
            .then(fetchAllGroupsMemberResponse)
            .catch(this.queryFailed);

        function fetchAllGroupsMemberResponse(data: breeze.QueryResult): ecat.entity.IWorkGroup {
            workGroup = data.results[0] as ecat.entity.IWorkGroup;

            if (workGroup.groupMembers && workGroup.groupMembers.length > 0) {
                that.isLoaded.allGroupMembers[workGroup.workGroupId] = true;
                that.log.success('Retrieved WorkGroup with Members from remote cache', workGroup, false);
            }

            return workGroup;
        }
    }

    getAllCourses(): Array<ecat.entity.ICourse> {
        return this.manager.getEntities(_mp.MpEntityType.course) as Array<ecat.entity.ICourse>;
    }

    getAllWorkGroups(courseId: number): Array<ecat.entity.IWorkGroup> {
        const course = this.manager.getEntityByKey(_mp.MpEntityType.course, courseId) as ecat.entity.ICourse;
        return course.workGroups;
    }

    getFacultyById(facId: number): ecat.entity.IPerson {
        return this.manager.getEntityByKey(_mp.MpEntityType.person, facId) as ecat.entity.IPerson;
    }

    getGroupMembers(workGroupId: number): Array<ecat.entity.IPerson> {
        const workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, workGroupId) as ecat.entity.IWorkGroup;
        const members = workGroup.groupMembers.map(gm => gm.studentProfile.person);
        return members;
    }

    pollCourses(forcedRefresh?: boolean): breeze.promises.IPromise<ecat.entity.ICourseRecon | angular.IPromise<void>> {

        const that = this;

        let courseRecon: ecat.entity.ICourseRecon;

        if (this.isLoaded.courseRecon && forcedRefresh) {
            courseRecon = this.manager.getEntityByKey(_mp.MpEntityType.courseRecon, this.loadedKeys.courseRecon) as ecat.entity.ICourseRecon;
            if (courseRecon) {
                this.log.success('Retrieved All Courses from local cache', courseRecon, false);
                return this.c.$q.when(courseRecon);
            }
        }

        return this.query.from('PollCourses')
            .using(this.manager)
            .toType(_mp.MpEntityType.courseRecon)
            .execute()
            .then(fetchCourseReconResponse)
            .catch(this.queryFailed);

        function fetchCourseReconResponse(data: breeze.QueryResult): ecat.entity.ICourseRecon {
            courseRecon = data.results[0] as ecat.entity.ICourseRecon;

            if (courseRecon) {
                that.isLoaded.courseRecon = true;
                that.loadedKeys.courseRecon = courseRecon.id;
                that.log.success('Retrieved All Courses from remote cache', courseRecon, false);
            }

            return courseRecon;
        }
    }

    pollCourseMembers(courseId: number, forcedRefresh?: boolean): breeze.promises.IPromise<ecat.entity.IMemRecon | angular.IPromise<void>> {

        const that = this;

        let memRecon: ecat.entity.IMemRecon;

        if (this.isLoaded.memRecon && !forcedRefresh) {
            memRecon = this.manager.getEntityByKey(_mp.MpEntityType.memRecon, this.loadedKeys.memRecon) as ecat.entity.IMemRecon;
            if (memRecon) {
                this.log.success('Retrieved Course Member Reconciliation from local cache', memRecon, false);
                return this.c.$q.when(memRecon);
            }
        }

        return this.query.from(this.apis.pollCourseMembers)
            .using(this.manager)
            .withParameters({courseId: courseId})
            .toType(_mp.MpEntityType.memRecon)
            .execute()
            .then(fetchCourseMemReconResponse)
            .catch(this.queryFailed);

        function fetchCourseMemReconResponse(data: breeze.QueryResult): ecat.entity.IMemRecon {
            memRecon = data.results[0] as ecat.entity.IMemRecon;

            if (memRecon) {
                that.isLoaded.memRecon = true;
                that.loadedKeys.memRecon = memRecon.id;
                that.log.success('Retrieved Course Member Reconciliation from remote cache', memRecon, false);
            }

            return memRecon;
        }
    }

    pollActiveGroupMembers(workGroupId: number, forcedRefresh?: boolean): breeze.promises.IPromise<ecat.entity.IGrpMemRecon | angular.IPromise<void>> {

        const that = this;

        let grpMemRecon: ecat.entity.IGrpMemRecon;

        if (this.isLoaded.grpMemRecon[workGroupId] && !forcedRefresh) {
            grpMemRecon = this.manager.getEntityByKey(_mp.MpEntityType.grpMemRecon, this.loadedKeys.grpMemRecon[workGroupId]) as ecat.entity.IGrpMemRecon;
            if (grpMemRecon) {
                this.log.success('Retrieved Group Member Reconciliation from local cache', grpMemRecon, false);
                return this.c.$q.when(grpMemRecon);
            }
        }

        return this.query.from(this.apis.pollGroupMembers)
            .using(this.manager)
            .withParameters({workGroupId: workGroupId})
            .toType(_mp.MpEntityType.grpMemRecon)
            .execute()
            .then(fetchGrpMemReconResponse)
            .catch(this.queryFailed);

        function fetchGrpMemReconResponse(data: breeze.QueryResult): ecat.entity.IGrpMemRecon {
            grpMemRecon = data.results[0] as ecat.entity.IGrpMemRecon;

            if (grpMemRecon) {
                that.isLoaded.grpMemRecon[workGroupId] = true;
                that.loadedKeys.grpMemRecon[workGroupId] = grpMemRecon.id;
                that.log.success('Retrieved Course Member Reconciliation from remote cache', grpMemRecon, false);
            }

            return grpMemRecon;
        }
    }

    pollGroupCatMembers(courseId: number, groupCategory: string, forcedRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.IGrpMemRecon> | angular.IPromise<void>> {
        const that = this;
        let grpMemRecons: Array<ecat.entity.IGrpMemRecon>;

        if (!forcedRefresh && this.isLoaded.grpMemRecon[courseId] && this.isLoaded.grpMemRecon[courseId][groupCategory]) {
            const gmrs = this.manager.getEntities(_mp.MpEntityType.grpMemRecon) as Array<ecat.entity.IGrpMemRecon>;
            if (gmrs && gmrs.length > 0) {
                const relatedGmr = gmrs.filter(gmr => gmr.courseId === courseId && gmr.groupType === groupCategory);
                this.log.success('Retrieved Group Member Reconciliation from local cache', relatedGmr, false);
                return this.c.$q.when(relatedGmr);
            }
        }

        return this.query.from(this.apis.pollGroupCategory)
            .using(this.manager)
            .withParameters({ courseId: courseId, category: groupCategory})
            .toType(_mp.MpEntityType.grpMemRecon)
            .execute()
            .then(fetchGrpMemReconResponse)
            .catch(this.queryFailed);

        function fetchGrpMemReconResponse(data: breeze.QueryResult): Array<ecat.entity.IGrpMemRecon> {
            grpMemRecons = data.results as Array<ecat.entity.IGrpMemRecon>;

            if (grpMemRecons && grpMemRecons.length) {
                grpMemRecons.forEach(gmr => {

                    if (!that.isLoaded.grpMemRecon[courseId]) {
                        that.isLoaded.grpMemRecon[courseId] = {};
                    }
                    that.isLoaded.grpMemRecon[courseId][groupCategory] = true;
                });
                that.log.success('Retrieved Course Member Reconciliation from remote cache', grpMemRecons, false);
            }

            return grpMemRecons;
        }
    }

    pollGroups(courseId: number, forcedRefresh?: boolean): breeze.promises.IPromise<ecat.entity.IGrpRecon | angular.IPromise<void>> {

        const that = this;

        let grpRecon: ecat.entity.IGrpRecon;

        if (this.isLoaded.grpRecon[courseId] && forcedRefresh) {
            grpRecon = this.manager.getEntityByKey(_mp.MpEntityType.groupRecon, this.loadedKeys.grpRecon[courseId]) as ecat.entity.IGrpRecon;
            if (grpRecon) {
                this.log.success('Retrieved Course Member Reconciliation from local cache', grpRecon, false);
                return this.c.$q.when(grpRecon);
            }
        }

        return this.query.from(this.apis.pollGroups)
            .using(this.manager)
            .withParameters({courseId: courseId})
            .toType(_mp.MpEntityType.groupRecon)
            .execute()
            .then(fetchGroupReconResponse)
            .catch(this.queryFailed);

        function fetchGroupReconResponse(data: breeze.QueryResult): ecat.entity.IGrpRecon {
            grpRecon = data.results[0] as ecat.entity.IGrpRecon;

            if (grpRecon) {
                that.isLoaded.grpRecon[courseId] = true;
                that.loadedKeys.grpRecon[courseId] = grpRecon.id;
                that.log.success('Retrieved Group Reconciliation from remote cache', grpRecon, false);
            }

            return grpRecon;
        }
    }

    syncGrades(courseId: number, wgCategory: string): breeze.promises.IPromise<Array<ecat.entity.ISaveGradesResp> | angular.IPromise<void>> {

        const that = this;

        return this.query.from(this.apis.syncGrades)
            .using(this.manager)
            .withParameters({ crseId: courseId, wgCategory: wgCategory })
            //.toType('SaveGradesResp')
            .execute()
            .then(syncGradesResponse)
            .catch(this.queryFailed);

        function syncGradesResponse(data: breeze.QueryResult): Array<ecat.entity.ISaveGradesResp> {
            var response = data.results as Array<ecat.entity.ISaveGradesResp>;

            if (response[0].result === 'failed') {
                that.log.error(response[1].result, response, false);
            } else {
                that.log.success('Successfully synced ' + wgCategory + ' grades', response, false);
            }

            return response;
        }
    }
}





