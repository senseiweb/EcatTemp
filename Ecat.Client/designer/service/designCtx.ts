import IUtilityRepo from 'core/service/data/utility'
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

interface IDesignerApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource;
    course: ecat.IApiResource;
    workGroup: ecat.IApiResource;
    wgResult: ecat.IApiResource;
}

export default class EcDesignerRepo extends IUtilityRepo {
    static serviceId = 'data.designer';
    static $inject = ['$injector'];

    activated = false;
    isLoaded = {
        initCourses: false,
        course: {},
        crseInStudGroup: {},
        workGroup: {},
        wgResult: {},
        spInventory: {}
    }

    private designerApiResources: IDesignerApiResources = {
        initCourses: {
            returnedEntityType: _mp.MpEntityType.course,
            resource: 'GetCourses'
        },
        course: {
            returnedEntityType: _mp.MpEntityType.course,
            resource: 'ActiveCourse'
        },
        workGroup: {
            returnedEntityType: _mp.MpEntityType.workGroup,
            resource: 'ActiveWorkGroup'
        },
        wgResult: {
            returnedEntityType: _mp.MpEntityType.spResult,
            resource: 'GetMyWgResult'
        }
    }

    constructor(inj) {
        super(inj, 'Designer Data Service', _mp.MpApiResource.designer, null);
        super.addResources(this.designerApiResources);
        this.isLoaded.course = {};
        this.isLoaded.workGroup = {};
        this.isLoaded.crseInStudGroup = {}
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

    //fetchActiveCourse(): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
    //    const that = this;

    //    if (!this.activeCourseId) {
    //        this.log.warn('Not active course selected!', null, true);
    //        return this.c.$q.reject(() => {
    //            return 'A course must be selected';
    //        });;
    //    }

    //    let course: ecat.entity.ICourse;
    //    const api = this.studentApiResources;

    //    if (this.isLoaded.course[this.activeCourseId]) {
    //        course = this.manager.getEntityByKey(_mp.MpEntityType.course, this.activeCourseId) as ecat.entity.ICourse;
    //        this.log.success('Course loaded from local cache', course, false);
    //        return this.c.$q.when(course);
    //    }

    //    return this.query.from(api.course.resource)
    //        .using(this.manager)
    //        .withParameters({ crseId: this.activeCourseId })
    //        .execute()
    //        .then(fetchActiveCrseReponse)
    //        .catch(this.queryFailed);

    //    function fetchActiveCrseReponse(data: breeze.QueryResult) {
    //        course = data.results[0] as ecat.entity.ICourse;
    //        if (!course) {
    //            const error: ecat.IQueryError = {
    //                errorMessage: 'An active course was not received from the server.',
    //                errorType: _mpe.QueryError.UnexpectedNoResult
    //            }
    //            that.log.warn('Query succeeded, but the course membership did not return a result', data, false);
    //            return that.c.$q.reject(error) as any;
    //        }

    //        that.isLoaded.course[course.id] = true;

    //        if (course.workGroups && course.workGroups.length > 0) {
    //            const groups = course.workGroups;

    //            groups.forEach(grp => {
    //                if (grp.groupMembers && grp.groupMembers.length > 0) that.isLoaded.workGroup[grp.workGroupId] = true;
    //            });
    //        }
    //        that.log.success('Course loaded from remote data store', course, false);
    //        return course;
    //    }
    //}

    //fetchActiveWorkGroup(): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
    //    const that = this;
    //    if (!this.activeGroupId || !this.activeCourseId) {
    //        this.log.warn('Not active course/workgroup selected!', null, true);
    //        return this.c.$q.reject(() => {
    //            return 'A course/workgroup must be selected';
    //        });
    //    }
    //    let workGroup: ecat.entity.IWorkGroup;
    //    const api = this.studentApiResources;

    //    if (this.isLoaded.workGroup[this.activeGroupId] && this.isLoaded.spInventory[this.activeGroupId]) {
    //        workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

    //        that.log.success('Workgroup loaded from local cache', workGroup, false);
    //        return this.c.$q.when(workGroup);
    //    }

    //    const params = { wgId: this.activeGroupId, addAssessment: false };

    //    if (!this.isLoaded.spInventory[this.activeGroupId]) {
    //        params.addAssessment = true;
    //    }

    //    return this.query.from(api.workGroup.resource)
    //        .using(this.manager)
    //        .withParameters(params)
    //        .execute()
    //        .then(getActiveWorkGrpResponse)
    //        .catch(this.queryFailed);

    //    function getActiveWorkGrpResponse(data: breeze.QueryResult) {
    //        workGroup = data.results[0] as ecat.entity.IWorkGroup;

    //        if (!workGroup) {
    //            const error: ecat.IQueryError = {
    //                errorMessage: 'Could not find this active workgroup on the server',
    //                errorType: _mpe.QueryError.UnexpectedNoResult
    //            }
    //            that.log.warn('Query succeeded, but the course membership did not return a result', data, false);
    //            return that.c.$q.reject(() => error) as any;
    //        }

    //        that.isLoaded.workGroup[workGroup.workGroupId] = true;
    //        that.isLoaded.spInventory[workGroup.workGroupId] = (workGroup.assignedSpInstr) ? true : false;

    //        return workGroup;
    //    }
    //}

    //fetchWgSpResult(): breeze.promises.IPromise<ecat.entity.ISpResult | angular.IPromise<void>> {
    //    const that = this;
    //    const resource = this.studentApiResources.wgResult.resource;

    //    if (this.isLoaded.wgResult[this.activeGroupId]) {
    //        const cachedResult = this.manager.getEntities(_mp.MpEntityType.spResult) as Array<ecat.entity.ISpResult>;

    //        const result = cachedResult.filter(cr => cr.workGroupId === this.activeGroupId)[0];
    //        if (result) {
    //            return this.c.$q.when(result);
    //        }
    //    }

    //    const params = { wgId: this.activeGroupId, addInstrument: false };

    //    if (!this.isLoaded.spInventory[this.activeGroupId]) {
    //        params.addInstrument = true;
    //    }

    //    return this.query.from(resource)
    //        .withParameters(params)
    //        .using(this.manager)
    //        .execute()
    //        .then(getWgSpResultResponse)
    //        .catch(this.queryFailed);

    //    function getWgSpResultResponse(data: breeze.QueryResult): ecat.entity.ISpResult {
    //        const result = data.results[0] as ecat.entity.ISpResult;
    //        if (!result) {
    //            const queryError: ecat.IQueryError = {
    //                errorMessage: 'No sp result was returned from the server',
    //                errorType: _mpe.QueryError.UnexpectedNoResult
    //            }
    //            return that.c.$q.reject(queryError) as any;
    //        }
    //        const workGroup = that.manager.getEntityByKey(_mp.MpEntityType.workGroup, that.activeGroupId) as ecat.entity.IWorkGroup;

    //        const inventory = workGroup.assignedSpInstr.inventoryCollection;
    //        if (!inventory) return that.c.$q.reject('Then required inventory for this result was not in the returned set;') as any;

    //        that.isLoaded.spInventory[workGroup.workGroupId] = true;
    //        that.isLoaded.wgResult[workGroup.workGroupId] = true;
    //        inventory.forEach(item => {
    //            item.spResult = result;
    //            return item;
    //        });
    //        return result;
    //    }
    //}

    //initStudentCourses(forceRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
    //    const that = this;
    //    const api = this.studentApiResources;
    //    const log = this.log;

    //    if (this.isLoaded.initCourses && !forceRefresh) {
    //        const allCourses = this.manager.getEntities(_mp.MpEntityType.course) as Array<ecat.entity.ICourse>;
    //        this.log.success('Courses loaded from local cache', allCourses, false);
    //        return this.c.$q.when(allCourses);
    //    }

    //    if (this.activationPromise) {
    //        return this.activationPromise;
    //    }

    //    this.activationPromise = this.query.from(api.initCourses.resource)
    //        .using(this.manager)
    //        .execute()
    //        .then(initCoursesReponse)
    //        .catch(this.queryFailed);

    //    return this.activationPromise;

    //    function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
    //        const courses = data.results as Array<ecat.entity.ICourse>;

    //        that.isLoaded.initCourses = courses.length > 0;

    //        courses.forEach(course => {
    //            var workGroups = course.workGroups;
    //            if (workGroups && workGroups.length > 0) {
    //                that.isLoaded[course.id] = true;

    //                workGroups.forEach(wg => {
    //                    if (wg.groupMembers && wg.groupMembers.length > 0) {
    //                        that.isLoaded.workGroup[wg.workGroupId] = true;
    //                    }
    //                });
    //            }
    //        });

    //        log.success('Courses loaded from remote store', courses, false);
    //        return courses;
    //    }
    //}

}