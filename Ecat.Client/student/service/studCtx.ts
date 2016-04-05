import IUtilityRepo from 'core/service/data/utility'
import {studCrseStudInGrpCfg} from "student/entityExtension/crseStudentInGroup"
import {studPersonCfg} from "core/entityExtension/person"
import {studSpInventoryCfg} from 'student/entityExtension/spInventory'
import {studStratCfg} from "student/entityExtension/stratReponse"
import {studResultCfg} from "student/entityExtension/spResult"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

interface IStudentApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource;
    course: ecat.IApiResource;
    workGroup: ecat.IApiResource;
    wgResult: ecat.IApiResource;
}

export default class EcStudentRepo extends IUtilityRepo {
    static serviceId = 'data.student';
    static $inject = ['$injector'];

    activated = false;
    activeCourseId: number;
    activeGroupId: number;
    activationPromise: breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>>;
    isActiving = false;
    isLoaded = {
        initCourses: false,
        course: {},
        crseInStudGroup: {},
        workGroup: {},
        wgResult: {},
        spInventory: {}
    }

    private studentApiResources: IStudentApiResources = {
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
        super(inj, 'Student Data Service', _mp.MpApiResource.student, [studPersonCfg, studCrseStudInGrpCfg, studSpInventoryCfg, studStratCfg, studResultCfg]);
        super.addResources(this.studentApiResources);
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

    fetchActiveCourse(): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
        const that = this;

        if (!this.activeCourseId) {
            this.log.warn('Not active course selected!', null, true);
            return this.c.$q.reject(() => {
                return 'A course must be selected';
            });;
        }

        let course: ecat.entity.ICourse;
        const api = this.studentApiResources;

        if (this.isLoaded.course[this.activeCourseId]) {
            course = this.manager.getEntityByKey(_mp.MpEntityType.course, this.activeCourseId) as ecat.entity.ICourse;
            this.log.success('Course loaded from local cache', course, false);
            return this.c.$q.when(course);
        }

        return this.query.from(api.course.resource)
            .using(this.manager)
            .withParameters({ crseId: this.activeCourseId })
            .execute()
            .then(fetchActiveCrseReponse)
            .catch(this.queryFailed);

        function fetchActiveCrseReponse(data: breeze.QueryResult) {
            course = data.results[0] as ecat.entity.ICourse;
            if (!course) {
                const error: ecat.IQueryError = {
                    errorMessage: 'An active course was not received from the server.',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                that.log.warn('Query succeeded, but the course membership did not return a result', data, false);
                return that.c.$q.reject(error) as any;
            }

            that.isLoaded.course[course.id] = true;

            if (course.workGroups && course.workGroups.length > 0) {
                const groups = course.workGroups;

                groups.forEach(grp => {
                    if (grp.groupMembers && grp.groupMembers.length > 0) that.isLoaded.workGroup[grp.workGroupId] = true;
                });
            }
            that.log.success('Course loaded from remote data store', course, false);
            return course;
        }
    }

    fetchActiveWorkGroup(): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
        const that = this;
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Not active course/workgroup selected!', null, true);
            return this.c.$q.reject(() => {
                return 'A course/workgroup must be selected';
            });
        }
        let workGroup: ecat.entity.IWorkGroup;
        const api = this.studentApiResources;

        if (this.isLoaded.workGroup[this.activeGroupId] && this.isLoaded.spInventory[this.activeGroupId]) {
            workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

            that.log.success('Workgroup loaded from local cache', workGroup, false);
            return this.c.$q.when(workGroup);
        }

        const params = { wgId: this.activeGroupId, addAssessment: false };

        if (!this.isLoaded.spInventory[this.activeGroupId]) {
            params.addAssessment = true;
        }

        return this.query.from(api.workGroup.resource)
            .using(this.manager)
            .withParameters(params)
            .execute()
            .then(getActiveWorkGrpResponse)
            .catch(this.queryFailed);

        function getActiveWorkGrpResponse(data: breeze.QueryResult) {
            workGroup = data.results[0] as ecat.entity.IWorkGroup;

            if (!workGroup) {
                const error: ecat.IQueryError = {
                    errorMessage: 'Could not find this active workgroup on the server',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                that.log.warn('Query succeeded, but the course membership did not return a result', data, false);
                return that.c.$q.reject(() => error) as any;
            }

            that.isLoaded.workGroup[workGroup.workGroupId] = true;
            that.isLoaded.spInventory[workGroup.workGroupId] = (workGroup.assignedSpInstr) ? true : false;

            return workGroup;
        }
    }

    fetchWgSpResult(): breeze.promises.IPromise<ecat.entity.ISpResult | angular.IPromise<void>> {
        const that = this;
        const resource = this.studentApiResources.wgResult.resource;
        let workGroup: ecat.entity.IWorkGroup;
        let inventory: Array<ecat.entity.ISpInventory>;

        if (this.isLoaded.wgResult[this.activeGroupId]) {
            const cachedResult = this.manager.getEntities(_mp.MpEntityType.spResult) as Array<ecat.entity.ISpResult>;
            workGroup = that.manager.getEntityByKey(_mp.MpEntityType.workGroup, that.activeGroupId) as ecat.entity.IWorkGroup;
            inventory = workGroup.assignedSpInstr.inventoryCollection;
            const result = cachedResult.filter(cr => cr.workGroupId === this.activeGroupId)[0];
            if (result) {
                inventory.forEach(item => {
                    item.resetResult();
                    item.spResult = result;
                    return item;
                });
                return this.c.$q.when(result);
            }
        }

        const params = { wgId: this.activeGroupId, addInstrument: false };

        if (!this.isLoaded.spInventory[this.activeGroupId]) {
            params.addInstrument = true;
        }

        return this.query.from(resource)
            .withParameters(params)
            .using(this.manager)
            .execute()
            .then(getWgSpResultResponse)
            .catch(this.queryFailed);

        function getWgSpResultResponse(data: breeze.QueryResult): ecat.entity.ISpResult {
            const result = data.results[0] as ecat.entity.ISpResult;
            if (!result) {
                const queryError: ecat.IQueryError = {
                    errorMessage: 'No sp result was returned from the server',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                return that.c.$q.reject(queryError) as any;
            }
            workGroup = that.manager.getEntityByKey(_mp.MpEntityType.workGroup, that.activeGroupId) as ecat.entity.IWorkGroup;

            inventory = workGroup.assignedSpInstr.inventoryCollection;
            if (!inventory) return that.c.$q.reject('Then required inventory for this result was not in the returned set;') as any;

            that.isLoaded.spInventory[workGroup.workGroupId] = true;
            that.isLoaded.wgResult[workGroup.workGroupId] = true;
            inventory.forEach(item => {
                item.resetResult();
                item.spResult = result;
                return item;
            });
            return result;
        }
    }

    getAllStrats(): Array<ecat.entity.IStratResponse> {

        const loggedUserId = this.dCtx.user.persona.personId;
        const workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }

        return workGroup.groupMembers.map(gm => {
            const existingStrat = gm.assesseeStratResponse.filter(strat => strat.assessorPersonId === loggedUserId)[0];

            if (existingStrat) {
                return existingStrat;
            }

            return this.manager.createEntity(_mp.MpEntityType.spStrat, {
                assesseePersonId: gm.studentId,
                assessorPersonId: loggedUserId,
                courseId: this.activeCourseId,
                workGroupId: this.activeGroupId
            }) as ecat.entity.IStratResponse;

        });
    }

    getNewSpAssessResponse(assessor: ecat.entity.ICrseStudInGroup, assessee: ecat.entity.ICrseStudInGroup, inventory: ecat.entity.IStudSpInventory): ecat.entity.ISpResponse {
        const newAssessResponse = {
            assessor: assessor,
            assessee: assessee,
            inventoryItem: inventory
        }

        return this.manager.createEntity(_mp.MpEntityType.spResponse, newAssessResponse) as ecat.entity.ISpResponse;
    }

    getOrAddComment(recipientId: number) {
        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeGroupId, courseId: this.activeCourseId }, false);
        }

        const spComments = this.manager.getEntities(_mp.MpEntityType.spComment) as Array<ecat.entity.IStudSpComment>;

        let spComment = spComments.filter(comment => comment.authorPersonId === loggedUserId &&
            comment.recipientPersonId === recipientId &&
            comment.courseId === this.activeCourseId &&
            comment.workGroupId === this.activeGroupId)[0];

        if (spComment) {
            return spComment;
        }

        const newComment = {
            authorPersonId: loggedUserId,
            recipientPersonId: recipientId,
            courseId: this.activeCourseId,
            workGroupId: this.activeGroupId,
            commentVersion: 0,
            requestAnonymity: false
        };

        const newFlag = {
            authorPersonId: loggedUserId,
            recipientPersonId: recipientId,
            courseId: this.activeCourseId,
            mpAuthor: _mp.MpCommentFlag.neut
        }

        const returnedComment = this.manager.createEntity(_mp.MpEntityType.spComment, newComment) as ecat.entity.IStudSpComment;
        const flag = this.manager.createEntity(_mp.MpEntityType.spCommentFlag, newFlag) as ecat.entity.IStudSpCommentFlag;
        returnedComment.flag = flag;
        return returnedComment;
    }

    getSpInventory(assesseeId: number): Array<ecat.entity.ISpInventory> {
        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeGroupId, courseId: this.activeCourseId }, false);
            return null;
        }

        const workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        if (!workGroup.assignedSpInstr) {
            this.log.warn('Missing an assigned instrument for this workgroup', workGroup, false);
            return null;
        }

        const inventoryList = workGroup.assignedSpInstr.inventoryCollection as Array<ecat.entity.IStudSpInventory>;

        return inventoryList.map(item => {
            const key = { assessorPersonId: loggedUserId, assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId, inventoryItemId: item.id };

            let spResponse = this.manager.getEntityByKey(_mp.MpEntityType.spResponse, [loggedUserId, assesseeId, this.activeCourseId, this.activeGroupId, item.id]) as ecat.entity.ISpResponse;

            if (!spResponse) {
                spResponse = this.manager.createEntity(_mp.MpEntityType.spResponse, key) as ecat.entity.ISpResponse;
            }

            item.resetAssess();
            item.responseForAssessee = spResponse;
            return item;
        });
    }

    getActiveWgMember(studentId: number): ecat.entity.ICrseStudInGroup {
        return this.manager.getEntityByKey(_mp.MpEntityType.crseStudInGrp, [studentId, this.activeCourseId, this.activeGroupId]) as ecat.entity.ICrseStudInGroup;
    }

    getActiveWgMemberships(): Array<ecat.entity.ICrseStudInGroup> {
        const cachedGroupMembers = this.manager.getEntities(_mp.MpEntityType.crseStudInGrp) as Array<ecat.entity.ICrseStudInGroup>;
        return cachedGroupMembers.filter(gm => gm.courseId === this.activeCourseId && gm.workGroupId === this.activeGroupId);
    }

    getSingleStrat(studentId: number): ecat.entity.IStratResponse {

        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupId: this.activeCourseId, courseId: this.activeCourseId }, false);
            return null;
        }

        const existingStrat = this.manager.getEntityByKey(_mp.MpEntityType.spStrat, [loggedUserId, studentId, this.activeCourseId, this.activeGroupId]) as ecat.entity.IStratResponse;

        if (existingStrat) this.log.info('Strat for this individual not found', { assessor: loggedUserId, assessee: studentId, course: this.activeCourseId, workGroup: this.activeGroupId }, false);

        return (existingStrat) ? existingStrat :
            this.manager.createEntity(_mp.MpEntityType.spStrat, {
                assesseePersonId: studentId,
                assessorPersonId: loggedUserId,
                courseId: this.activeCourseId,
                workGroupId: this.activeGroupId
            }) as ecat.entity.IStratResponse;

    }

    initStudentCourses(forceRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const that = this;
        const api = this.studentApiResources;
        const log = this.log;

        if (this.isLoaded.initCourses && !forceRefresh) {
            const allCourses = this.manager.getEntities(_mp.MpEntityType.course) as Array<ecat.entity.ICourse>;
            this.log.success('Courses loaded from local cache', allCourses, false);
            return this.c.$q.when(allCourses);
        }

        if (this.activationPromise) {
            return this.activationPromise;
        }

        this.activationPromise = this.query.from(api.initCourses.resource)
            .using(this.manager)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        return this.activationPromise;

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
            const courses = data.results as Array<ecat.entity.ICourse>;

            that.isLoaded.initCourses = courses.length > 0;

            courses.forEach(course => {
                var workGroups = course.workGroups;
                if (workGroups && workGroups.length > 0) {
                    that.isLoaded[course.id] = true;

                    workGroups.forEach(wg => {
                        if (wg.groupMembers && wg.groupMembers.length > 0) {
                            that.isLoaded.workGroup[wg.workGroupId] = true;
                        }
                    });
                }
            });

            log.success('Courses loaded from remote store', courses, false);
            return courses;
        }
    }

}