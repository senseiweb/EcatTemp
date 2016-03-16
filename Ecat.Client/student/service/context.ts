import IUtilityRepo from 'core/service/data/utility'
import {studCrseStudInGrpCfg} from "student/entityExtension/crseStudentInGroup"
import {studPersonCfg} from "core/entityExtension/person"
import {studSpInventoryCfg} from 'student/entityExtension/spInventory'
import {studStratCfg} from "student/entityExtension/stratReponse"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

interface IStudentApiResources extends ecat.IApiResources {
    courses: ecat.IApiResource;
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
    isLoaded = {
        courses: false,
        course: {},
        crseInStudGroup: {},
        workGroup: {},
        wgResult: {},
        spInventory: {}
    }
    private studentApiResources: IStudentApiResources = {
        courses: {
            returnedEntityType: _mp.MpEntityType.crseStudInGrp,
            resource: 'InitCourse'
        },
        course: {
            returnedEntityType: _mp.MpEntityType.studCrseMember,
            resource: 'ActiveCourse'
        },
        workGroup: {
            returnedEntityType: _mp.MpEntityType.crseStudInGrp,
            resource: 'ActiveWorkGroup'
        },
        wgResult: {
            returnedEntityType: _mp.MpEntityType.spResult,
            resource: 'GetMyWgResult'
        }
    }

    constructor(inj) {
        super(inj, 'Student Data Service', _mp.MpApiResource.student, [studPersonCfg, studCrseStudInGrpCfg, studSpInventoryCfg, studStratCfg]);
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

    initCrseStudGroup(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICrseStudInGroup> | angular.IPromise<void>> {
        const that = this;
        const api = this.studentApiResources;
        const log = this.log;

        const orderBy = 'course.startDate desc';

        if (this.isLoaded.courses && !forceRefresh) {
            const courseMems = this.queryLocal(api.courses.resource, orderBy) as Array<ecat.entity.ICrseStudInGroup>;
            this.log.success('Courses loaded from local cache', courseMems, false);
            return this.c.$q.when(courseMems);
        }

        return this.query.from(api.courses.resource)
            .using(this.manager)
            .orderBy(orderBy)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICrseStudInGroup> {
            const crseStudInGroups = data.results as Array<ecat.entity.ICrseStudInGroup>;

            that.isLoaded.courses = crseStudInGroups.length > 0;

            crseStudInGroups.forEach(crseStudInGroup => {

                that.isLoaded.crseInStudGroup[crseStudInGroup.entityId] = true;

                if (crseStudInGroup.course) {
                    that.isLoaded[crseStudInGroup.courseId] = true;
                }

                if (crseStudInGroup.workGroup && crseStudInGroup.workGroup.groupMembers.length > 1) {
                        that.isLoaded.workGroup[crseStudInGroup.workGroupId] = true;
                    }
            });

            log.success('Courses loaded from remote store', data, false);

            return crseStudInGroups;
        }
    }

    /**
     * @desc  Gets the active course membership with course and group membership for the latest join workgroup, i.e. BC4.
     */
    getActiveCourse(): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
        if (!this.activeCourseId) {
            this.log.warn('Not active course selected!', null, false);
            return this.c.$q.reject(() => {
                return 'A course must be selected';
            });;
        }

        let course: ecat.entity.ICourse;
        const _common = this.c;
        const log = this.log;
        const api = this.studentApiResources;
        const pred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);

        if (this.isLoaded.course[this.activeCourseId]) {
            const studInCourse = this.queryLocal(api.course.resource, null, pred) as ecat.entity.IStudInCrse;
            course = studInCourse.course;
            log.success('Course loaded from local cache', course, false);
            return this.c.$q.when(course);
        }

        return this.query.from(api.course.resource)
            .using(this.manager)
            .where(pred)
            .execute()
            .then(getActiveCrseReponse)
            .catch(this.queryFailed);

        function getActiveCrseReponse(data: breeze.QueryResult) {
            const that = this;
            const studInCrse = data.results[0] as ecat.entity.IStudInCrse;

            if (!studInCrse) {
                return _common.$q.reject(() => log.warn('Query succeeded, but the course membership did not return a result', data, false)) as any;
            }
            course = studInCrse.course;
            that.isLoaded.course[course.id] = true;

            if (course.workGroups) {
                const groups = course.workGroups;

                groups.forEach(grp => {
                    that.isLoaded.workGroup[grp.id] = true;
                });
            }

            if (course.studentInCrseGroups && course.studentInCrseGroups.length > 1) {
                const crseStudInGroups = course.studentInCrseGroups;
                crseStudInGroups.forEach(stud => {
                    that.isLoaded.crseInStudGroup[stud.entityId] = true;
                });
            }
            return course;
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

    getActiveWorkGroup(): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
        const that = this;
        if (!this.activeGroupId || !this.activeCourseId) {
            this.c.$q.reject(() => {
                this.log.warn('Not active course/workgroup selected!', null, false);
                return 'A course/workgroup must be selected';
            });
        }
        let workGroup: ecat.entity.IWorkGroup;
        const _common = this.c;
        const log = this.log;
        const api = this.studentApiResources;
        const groupPred = new breeze.Predicate('workGroupId', breeze.FilterQueryOp.Equals, this.activeGroupId);
        const coursePred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);
        const predKey = breeze.Predicate.and([coursePred, groupPred]);

        if (that.isLoaded.workGroup[this.activeGroupId]) {
            const studInGroup = this.queryLocal(api.workGroup.resource, null, predKey) as Array<ecat.entity.ICrseStudInGroup>;
            workGroup = studInGroup[0].workGroup;
            log.success('Workgroup loaded from local cache', studInGroup, false);
            return this.c.$q.when(workGroup);
        }

        return this.query.from(api.workGroup.resource)
            .using(this.manager)
            .where(predKey)
            .execute()
            .then(getActiveWorkGrpResponse)
            .catch(this.queryFailed);

        function getActiveWorkGrpResponse(data: breeze.QueryResult) {
            const studInGroup = data.results[0] as ecat.entity.ICrseStudInGroup;

            workGroup = studInGroup.workGroup;

            if (!workGroup) {
                return _common.$q.reject(() => log.warn('Query succeeded, but the course membership did not return a result', data, false)) as any;
            }

            that.isLoaded.workGroup[workGroup.id] = true;

            if (workGroup.groupMembers) {
                const members = workGroup.groupMembers;

                members.forEach(member => {
                    that.isLoaded.workGroup[member.entityId] = true;
                });
            }

            return workGroup;
        }
    }

    getNewSpAssessResponse(assessor: ecat.entity.ICrseStudInGroup, assessee: ecat.entity.ICrseStudInGroup, inventory:ecat.entity.IStudSpInventory): ecat.entity.ISpResponse {
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
            mpCommentFlagAuthor: _mp.MpCommentFlag.neut,
            requestAnonymity: false
    };

        const newFlag = {
            authorPersonId: loggedUserId,
            recipientPersonId: recipientId,
            courseId: this.activeCourseId,
            mpAuthorFlag: _mp.MpCommentFlag.neut
        }

        const comment = this.manager.createEntity(_mp.MpEntityType.spComment, newComment) as ecat.entity.IStudSpComment;
        const flag = this.manager.createEntity(_mp.MpEntityType.spCommentFlag, newFlag) as ecat.entity.IStudSpCommentFlag;
        comment.flag = flag;
        return comment;
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

            item.reset();
            item.responseForAssessee = spResponse;
            return item;
        });
    }

    getWgSpResult(): breeze.promises.IPromise<ecat.entity.ISpResult | angular.IPromise<void>> {
        const that = this;
        const resource = this.studentApiResources.wgResult.resource;

        if (this.isLoaded.wgResult[this.activeGroupId]) {
            const cachedResult = this.manager.getEntities(_mp.MpEntityType.spResult) as Array<ecat.entity.ISpResult>;

            const result = cachedResult.filter(cr => cr.workGroupId === this.activeGroupId)[0];
            if (result) {
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
            .using(breeze.MergeStrategy.PreserveChanges)
            .execute()
            .then(getWgSpResultResonse)
            .catch(this.queryFailed);

        function getWgSpResultResonse(data: breeze.QueryResult): ecat.entity.ISpResult {
            const result = data.results[0] as ecat.entity.ISpResult;
            if (!result) {
                const queryError: ecat.IQueryError = {
                    errorMessage: 'No sp result was returned from the server',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                return that.c.$q.reject(queryError) as any;
            }
            const workGroup = that.manager.getEntityByKey(_mp.MpEntityType.workGroup, that.activeGroupId) as ecat.entity.IWorkGroup;
            
            const inventory = workGroup.assignedSpInstr.inventoryCollection;
            if (!inventory) return that.c.$q.reject('Then required inventory for this result was not in the returned set;') as any;

            that.isLoaded.spInventory[workGroup.id] = true;
            that.isLoaded.wgResult[workGroup.id] = true;
            inventory.forEach(item => {
                item.spResult = result;
                if (item.id === 2) {
                    console.log(item);
                }
                var dummyResult = item.resultBreakOut;
                return item;
            });
            return result;
        }
    }
}