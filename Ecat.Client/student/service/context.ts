import IUtilityRepo from 'core/service/data/utility'
import * as _crseStudGroup from "core/entityExtensions/crseStudentInGroup"
import * as _mp from "core/common/mapStrings"

interface IStudentApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource;
    getCourseGroupMembers: ecat.IApiResource;
    getGroupMembers: ecat.IApiResource;
}

export default class EcStudentRepo extends IUtilityRepo {
    static serviceId = 'data.student';
    static $inject = ['$injector'];

    activated = false;
    activeCourseId: number;
    activeGroupId: number;

    private studentApiResources: IStudentApiResources = {
        initCourses: {
            returnedEntityType: _mp.EcMapEntityType.crseMember,
            resource: {
                name: 'GetInitalCourses',
                isLoaded: false
            }
        },
        getCourseGroupMembers: {
            returnedEntityType: _mp.EcMapEntityType.crseMember,
            resource: {
                name: 'GetCrseGrpMembers',
                isLoaded: {
                    course: {} as any
                }
            }
        },
        getGroupMembers: {
            returnedEntityType: _mp.EcMapEntityType.grpMember,
            resource: {
                name: 'GetGrpMember',
                isLoaded: {
                    group: {} as any
                }
            }
        }
    };

    constructor(inj) {
        super(inj, 'Student Data Service', _mp.EcMapApiResource.student, [_crseStudGroup.memberInGrpEntityExt]);
        this.loadManager(this.studentApiResources);
    }

    initCourses(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICrseStudInGroup> | angular.IPromise<void>> {
        const api = this.studentApiResources;
        const self = this;

        if (api.initCourses.resource.isLoaded && !forceRefresh) {
            const courseMems = this.queryLocal(api.initCourses.resource.name) as Array<ecat.entity.ICrseStudInGroup>;
            this.logSuccess('Courses loaded from local cache', courseMems, false);
            return this.c.$q.when(courseMems);
        }

        return this.query.from(api.initCourses.resource.name)
            .using(this.manager)
            .orderBy('course.startDate desc')
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICrseStudInGroup> {
            const studCourse = data.results as Array<ecat.entity.IStudInCrse>;
            studCourse.forEach(studCrse => {
                if (studCrse.workGroupEnrollments) {
                    studCrse.workGroupEnrollments.forEach(grp => {
                        api.getCourseGroupMembers.resource.isLoaded[grp.entityId] = true;
                        grp.getMigStatus();
                        console.log(grp.statusOfPeer);
                    });

                    api.getCourseGroupMembers.resource.isLoaded[studCrse.entityId] = true;
                }
            });
            self.logSuccess('Courses loaded from remote store', studCourse, false);
            return studCourse as any;
        }
    }

    /**
     * @desc  Gets the active course membership with course and group membership for the latest join workgroup, i.e. BC4.
     */
    getCourseGroupMembers(): breeze.promises.IPromise<ecat.entity.ICrseStudInGroup | angular.IPromise<void>> {
        if (!this.activeCourseId) {
            this.c.$q.reject(() => {
                this.logWarn('Not active course selected!', null, false);
                return 'A course must be selected';
            });
        }

        const self = this;
        let crseMem: ecat.entity.ICrseStudInGroup = null;
        const api = this.studentApiResources;
        const isLoaded = api.getCourseGroupMembers.resource.isLoaded.course;

        if (isLoaded[this.activeCourseId]) {
            const pred = new breeze.Predicate('id', breeze.FilterQueryOp.Equals, this.activeCourseId);

            crseMem = this.queryLocal(api.getCourseGroupMembers.resource.name, null, pred) as ecat.entity.ICrseStudInGroup;
            this.logSuccess('Course loaded from local cache', crseMem, false);
            return this.c.$q.when(crseMem);
        }

        return this.query.from(api.getCourseGroupMembers.resource.name)
            .using(this.manager)
            .withParameters({ crseMemId: this.activeCourseId })
            .execute()
            .then(getCoursesResponse)
            .catch(this.queryFailed);

        function getCoursesResponse(data: breeze.QueryResult) {

            crseMem = data.results[0] as ecat.entity.ICrseStudInGroup;

            if (!crseMem) {
                return self.c.$q.reject(() => self.logWarn('Query succeeded, but the course membership did not return a result', data, false)) as any;
            }

            //if (crseMem.courseEnrollmen) {
            //    const grpLoaded = api.getGroupMembers.resource.isLoaded.group;
            //    crseMem.studGroupEnrollments.forEach(grpMem => {
            //        grpLoaded[grpMem.id] = true;
            //    });
            //}

            return crseMem;
        }
    }

    getGroupMembers(): breeze.promises.IPromise<ecat.entity.ICrseStudInGroup | angular.IPromise<void>> {
        if (!this.activeGroupId) {
            this.c.$q.reject(() => {
                this.logWarn('Not active course selected!', null, false);
                return 'A course must be selected';
            });
        }

        const self = this;
        let grpMem: ecat.entity.ICrseStudInGroup = null;
        const api = this.studentApiResources;
        const isLoaded = api.getGroupMembers.resource.isLoaded.group;

        if (isLoaded[this.activeGroupId]) {
            const pred = new breeze.Predicate('id', breeze.FilterQueryOp.Equals, this.activeGroupId);

            grpMem = this.queryLocal(api.getGroupMembers.resource.name, null, pred) as ecat.entity.ICrseStudInGroup;
            this.logSuccess('Course loaded from local cache', grpMem, false);
            return this.c.$q.when(grpMem);
        }

        return this.query.from(api.getGroupMembers.resource.name)
            .using(this.manager)
            .withParameters({ grpMemId: this.activeGroupId })
            .execute()
            .then(getGrpMembersResponse)
            .catch(this.queryFailed);

        function getGrpMembersResponse(data: breeze.QueryResult) {

            grpMem = data.results[0] as ecat.entity.ICrseStudInGroup;

            if (!grpMem) {
                return self.c.$q.reject(() => self.logWarn('Query succeeded, but the group membership did not return a result', data, false)) as any;
            }

            return grpMem;
        }
    }


    getNewSpAssessResponse(assessor: ecat.entity.ICrseStudInGroup, assessee: ecat.entity.ICrseStudInGroup, inventory:ecat.entity.IStudSpInventory): ecat.entity.ISpRespnse {
        const newAssessResponse = {
            assessor: assessor,
            assessee: assessee,
            inventoryItem: inventory
        }

        return this.manager.createEntity(_mp.EcMapEntityType.spAssessResponse, newAssessResponse) as ecat.entity.ISpRespnse;
    }


    getOrAddComment(recipientId: number) {
        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.logWarn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
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
            authoerPersonId: loggedUserId,
            recipientPersonId: recipientId,
            courseId: this.activeCourseId,
            workGroupId: this.activeGroupId,
            commentVersion: 0,
            mpCommentFlagAuthor: _mp.MpCommentFlag.neut,
        }

        return this.manager.createEntity(_mp.EcMapEntityType.spComment, newComment) as ecat.entity.ISpComment;
    }


}