import IUtilityRepo from 'core/service/data/utility'
import {studCrseStudInGrpCfg} from "student/entityExtension/crseStudentInGroup"
import {studPersonCfg} from "core/entityExtension/person"
import {studSpInventoryCfg} from 'student/entityExtension/spInventory'
import * as _mp from "core/common/mapStrings"

interface IStudentApiResources extends ecat.IApiResources {
    courses: ecat.IApiResource;
    course: ecat.IApiResource;
    workGroup: ecat.IApiResource;
}

interface ICachedStudentData {
    courses: boolean;
    course: {};
    crseInStudGroup: {}
    workGroup: {};
}

export default class EcStudentRepo extends IUtilityRepo {
    static serviceId = 'data.student';
    static $inject = ['$injector'];

    activated = false;
    activeCourseId: number;
    activeGroupId: number;

    private studentApiResources: IStudentApiResources = {
        courses: {
            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
            resource: 'InitCourse'
        },
        course: {
            returnedEntityType: _mp.EcMapEntityType.studCrseMember,
            resource: 'ActiveCourse'
        },
        workGroup: {
            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
            resource: 'ActiveWorkGroup'
        }
    }

    constructor(inj) {
        super(inj, 'Student Data Service', _mp.EcMapApiResource.student, [studPersonCfg, studCrseStudInGrpCfg, studSpInventoryCfg]);
        this.loadManager(this.studentApiResources);
        this.isLoaded.course = {};
        this.isLoaded.workGroup = {};
        this.isLoaded.crseInStudGroup = {}
    }

    initCrseStudGroup(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICrseStudInGroup> | angular.IPromise<void>> {
        const api = this.studentApiResources;
        const isLoaded: ICachedStudentData = this.isLoaded;
        const log = this.log;

        const orderBy = 'course.startDate desc';

        if (isLoaded.courses && !forceRefresh) {
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

            isLoaded.courses = crseStudInGroups.length > 0;

            crseStudInGroups.forEach(crseStudInGroup => {

                isLoaded.crseInStudGroup[crseStudInGroup.entityId] = true;

                if (crseStudInGroup.course) {
                    isLoaded[crseStudInGroup.courseId] = true;
                }

                if (crseStudInGroup.workGroup && crseStudInGroup.workGroup.groupMembers.length > 1) {
                        isLoaded.workGroup[crseStudInGroup.workGroupId] = true;
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
            this.c.$q.reject(() => {
                this.log.warn('Not active course selected!', null, false);
                return 'A course must be selected';
            });
        }

        let course: ecat.entity.ICourse;
        const _common = this.c;
        const log = this.log;
        const api = this.studentApiResources;
        const pred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);
        const isLoaded = this.isLoaded as ICachedStudentData;

        if (isLoaded.course[this.activeCourseId]) {
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
            const studInCrse = data.results[0] as ecat.entity.IStudInCrse;

            if (!studInCrse) {
                return _common.$q.reject(() => log.warn('Query succeeded, but the course membership did not return a result', data, false)) as any;
            }
            course = studInCrse.course;
            isLoaded.course[course.id] = true;

            if (course.workGroups) {
                const groups = course.workGroups;

                groups.forEach(grp => {
                    isLoaded.workGroup[grp.id] = true;
                });
            }

            if (course.studentInCrseGroups && course.studentInCrseGroups.length > 1) {
                const crseStudInGroups = course.studentInCrseGroups;
                crseStudInGroups.forEach(stud => {
                    isLoaded.crseInStudGroup[stud.entityId] = true;
                });
            }
            return course;
        }
    }

    getActivetWorkGroup(): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
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
        const isLoaded = this.isLoaded as ICachedStudentData;

        if (isLoaded.workGroup[this.activeGroupId]) {
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

            isLoaded.workGroup[workGroup.id] = true;

            if (workGroup.groupMembers) {
                const members = workGroup.groupMembers;

                members.forEach(member => {
                    isLoaded.workGroup[member.entityId] = true;
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

        return this.manager.createEntity(_mp.EcMapEntityType.spResponse, newAssessResponse) as ecat.entity.ISpResponse;
    }

    getOrAddComment(recipientId: number) {
        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeGroupId, courseId: this.activeCourseId }, false);
        }

        const spComments = this.manager.getEntities(_mp.EcMapEntityType.spComment) as Array<ecat.entity.ISpComment>;

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
            mpCommentType: _mp.MpCommentType.signed 
        };

        return this.manager.createEntity(_mp.EcMapEntityType.spComment, newComment) as ecat.entity.ISpComment;
    }

    getSpInventory(assesseeId: number): Array<ecat.entity.ISpInventory> {
        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeGroupId, courseId: this.activeCourseId }, false);
            return null;
        }

        const workGroup = this.manager.getEntityByKey(_mp.EcMapEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        if (!workGroup.assignedSpInstr) {
            this.log.warn('Missing an assigned instrument for this workgroup', workGroup, false);
            return null;
        }

        const inventoryList = workGroup.assignedSpInstr.inventoryCollection as Array<ecat.entity.IStudSpInventory>;

        inventoryList.forEach(item => {
            const key = { assessorPersonId: loggedUserId, assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId, inventoryItemId: item.id };

            let spResponse = this.manager.getEntityByKey(_mp.EcMapEntityType.spResponse, [loggedUserId, assesseeId, this.activeCourseId, this.activeGroupId, item.id]) as ecat.entity.ISpResponse;

            if (!spResponse) {
                spResponse = this.manager.createEntity(_mp.EcMapEntityType.spResponse, key) as ecat.entity.ISpResponse;
            }

            item.responseForAssessee = spResponse;
        });

        return inventoryList;
    }

}