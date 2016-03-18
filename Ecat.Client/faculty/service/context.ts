import IUtilityRepo from 'core/service/data/utility'
import {facCrseStudInGrpCfg}from 'faculty/entityExtensions/crseStudentInGroup'
import {facWorkGrpEntityExt} from 'faculty/entityExtensions/workgroup'
import {facPersonCfg} from 'faculty/entityExtensions/person'
import {facSpInventoryCfg} from "faculty/entityExtensions/spInventory"
import {facSpCommentCfg} from "faculty/entityExtensions/spComment"
import {facStratCfg} from "faculty/entityExtensions/facStratResponse"
import * as _mp from 'core/common/mapStrings'
import * as _mpe from 'core/common/mapEnum'

interface IFacultyApiResources extends ecat.IApiResources {
    courses: ecat.IApiResource;
    course: ecat.IApiResource;
    wgAssess: ecat.IApiResource;
    wgComment: ecat.IApiResource;
    caCourse: ecat.IApiResource;
    wgResult: ecat.IApiResource;
}


export default class EcFacultyRepo extends IUtilityRepo {
    static serviceId = 'data.faculty';
    static $inject = ['$injector'];

    activeCourseId: number;
    activeGroupId: number;
    facRepoLoaded: angular.IPromise<any>;
    isLoaded = {
        crseInitialized: false,
        workGroup: {},
        wgSpComment: {},
        wgFacComment:{},
        course: {},
        spInstr: {},
        caCourse: {},
        spResult: {}
    }

    private facultyApiResource: IFacultyApiResources = {
        courses: {
            returnedEntityType: _mp.MpEntityType.facCrseMember,
            resource: 'InitCourses'
        },
        course: {
            returnedEntityType: _mp.MpEntityType.facCrseMember,
            resource: 'ActiveCourse'
        },
        wgAssess: {
            returnedEntityType: _mp.MpEntityType.crseStudInGrp,
            resource: 'WorkGroupAssess'
        },
        getStudentCapstoneDetails: {
            returnedEntityType: _mp.MpEntityType.crseStudInGrp,
            resource: 'GetStudentCapstoneDetails'
        },
        wgComment: {
            returnedEntityType: _mp.MpEntityType.spComment,
            resource: 'ActiveWgSpComment'
        },
        wgResult: {
            returnedEntityType: _mp.MpEntityType.crseStudInGrp,
            resource: 'WorkGroupResult'
        },
        caCourse: {
            returnedEntityType: _mp.MpEntityType.course,
            resource: 'CourseMembers'
        }
    }

    constructor(inj) {
        super(inj, 'Faculty Data Service', _mp.MpApiResource.faculty, [facSpInventoryCfg, facPersonCfg, facWorkGrpEntityExt, facCrseStudInGrpCfg, facSpCommentCfg, facStratCfg]);
        super.addResources(this.facultyApiResource);

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

    initializeCourses(forceRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const that = this;
        const resource = this.facultyApiResource.courses.resource;
        const log = this.log;
        const ordering = 'course.startDate desc';
        let courses: Array<ecat.entity.ICourse>;
        
        if (this.isLoaded.crseInitialized && !forceRefresh) {
            const cachedFacInCourse = this.queryLocal(resource) as Array<ecat.entity.IFacInCrse>;
            courses = cachedFacInCourse.map(facInCrse => facInCrse.course);
            this.log.success('Courses loaded from local cache', courses, false);
            return this.c.$q.when(courses);
        }

        return this.query.from(resource)
            .using(this.manager)
            .orderBy(ordering)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
            const facInCrses = data.results as Array<ecat.entity.IFacInCrse>;

            facInCrses.forEach(facCrse => {

                if (!facCrse.course.workGroups || facCrse.course.workGroups.length === 0) {
                    return null;
                }

                that.isLoaded.course[facCrse.courseId] = true;
                
                facCrse.course.workGroups.forEach(wg => {
                    if (wg.groupMembers && wg.groupMembers.length > 0) {
                        that.isLoaded.workGroup[wg.id] = true;
                    }
                });

            });
            courses = facInCrses.map(facCrse => facCrse.course);
            log.success('Courses loaded from remote store', data, false);
            that.activeCourseId = courses[0].id;
            that.isLoaded.crseInitialized = true;
            return courses;
        }
    }

    fetchActiveWgComments(): breeze.promises.IPromise<Array<ecat.entity.IStudSpComment> | angular.IPromise<void>> {
        if (!this.activeGroupId || !this.activeCourseId) {
            return this.c.$q.reject(this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false)) as any;
        }

        const log = this.log;
        const that = this;
        const resource = this.facultyApiResource.wgComment.resource;
        const wgPred = new breeze.Predicate('workGroupId', breeze.FilterQueryOp.Equals, this.activeGroupId);
        const crsePred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);
        if (this.isLoaded.wgSpComment[this.activeGroupId]) {
            const cachedWgComment = this.queryLocal(resource, null, crsePred.and(wgPred)) as Array<ecat.entity.IStudSpComment>;
            if (cachedWgComment) {
                log.success('Retrieved SpComments from local cache', cachedWgComment, false);
                return this.c.$q.resolve(cachedWgComment);
            }
        }

        return this.query.from(resource)
            .where(crsePred.and(wgPred))
            .using(this.manager)
            .execute()
            .then(fetchActiveWgCommentsResponse)
            .catch(this.queryFailed);

        function fetchActiveWgCommentsResponse(data: breeze.QueryResult): Array<ecat.entity.IStudSpComment> {
            const comments = data.results as Array<ecat.entity.IStudSpComment>;
            if (!comments || comments.length === 0) {
                return null;
            }

            that.isLoaded.wgSpComment[that.activeGroupId] = true;
            log.success('Retrieved SpComment for local data source', comments, false);
            return comments;
        }
    }

    fetchActiveCourse(): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {

        const log = this.log;
        const loggedInPersonId = this.dCtx.user.persona.personId;
        const that = this;
        let course: ecat.entity.ICourse;
        
        if (this.isLoaded.course[this.activeCourseId]) {
            const cachedFacInCourse = this.manager.getEntityByKey(_mp.MpEntityType.facCrseMember, [loggedInPersonId, this.activeCourseId]) as ecat.entity.IFacInCrse;

            if (cachedFacInCourse) {
               course = cachedFacInCourse.course;
               log.success('Course loaded from local cache', course, false);
               return this.c.$q.when(course);
            }
        }
        
        const resource = this.facultyApiResource.course.resource;
        return this.query.from(resource)
            .using(this.manager)
            .withParameters({courseId: this.activeCourseId})
            .execute()
            .then(getActiveCourseResponse)
            .catch(this.queryFailed);
                
        function getActiveCourseResponse(data: breeze.QueryResult): ecat.entity.ICourse {
            const facCrseResult = data.results[0] as ecat.entity.IFacInCrse;
            if (!facCrseResult) {
                return null;
            }
            
            course = facCrseResult.course;
            
            if (course.workGroups && course.workGroups.length > 0) {
               that.isLoaded.course[course.id] = true;
                course.workGroups.forEach(wg => {
                    if (wg.groupMembers && wg.groupMembers.length > 0) {
                        that.isLoaded.workGroup[wg.id] = true;
                    }
                });
            }
            log.success('Course loaded from remote store', course, false);
            return course;
        }
    }
    
    fetchActiveWorkGroup(): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
        const log = this.log;
        const that = this;
        let workGroup: ecat.entity.IWorkGroup;
        const cachedWg = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;
        
        //A loaded workgroup is a group that has group members on the client, not just the workgroup entity.
        if (this.isLoaded.workGroup[this.activeGroupId]) {
            if (cachedWg) {
               workGroup = cachedWg;
               log.success('WorkGroup loaded from local cache', workGroup, false);
               return this.c.$q.when(workGroup);
            }
        }
                
        const resource = this.facultyApiResource.wgAssess.resource;
        const params = {courseId: this.activeCourseId, workGroupId: this.activeGroupId, addAssessment: false};
     
        if (!cachedWg || !this.isLoaded.spInstr[cachedWg.assignedSpInstrId]) {
            params.addAssessment = true;
        }
        
          return  this.query.from(resource)
            .using(this.manager)
            .withParameters(params)
            .execute()
            .then(getActiveWorkGroupResponse)
            .catch(this.queryFailed);
                
        function getActiveWorkGroupResponse(data: breeze.QueryResult): ecat.entity.IWorkGroup {
            const groupMembers = data.results as Array<ecat.entity.ICrseStudInGroup>;
            if (!groupMembers || !(groupMembers.length > 0)) {
                return null;
            }
            
            workGroup = groupMembers[0].workGroup;
            
            that.isLoaded.workGroup[workGroup.id] = true;
            const inventory = workGroup.assignedSpInstr.inventoryCollection;
            
            if (inventory && inventory.length > 0 ) {
                that.isLoaded.spInstr[workGroup.assignedSpInstrId] = true;
            }
            
            log.success('WorkGroup loaded from remote store', workGroup, false);
            return workGroup;
        }
    }

    fetchActiveWgSpResults(): breeze.promises.IPromise<Array<ecat.entity.ICrseStudInGroup> | angular.IPromise<void>> {
        const that = this;
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
            return this.c.$q.reject('Missing result id information') as any;
        }
        const resource = this.facultyApiResource.wgResult.resource;
        const wgPred = new breeze.Predicate('workGroupId', breeze.FilterQueryOp.Equals, this.activeGroupId);
        const crsePred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);
        
        if (this.isLoaded.spResult[this.activeGroupId]) {
            const resultCached = this.queryLocal(resource, null, wgPred) as Array<ecat.entity.ICrseStudInGroup>;
            if (resultCached) {
                this.log.info('Retrieved workgroup result from the local cache', resultCached, false);
                return this.c.$q.when(resultCached);
            }
        }

        const params = {addAssessment: false, addComments: false };

        let workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        if (!this.isLoaded.wgSpComment[this.activeGroupId]) {
            params.addComments = true;
        }

        if (!workGroup || !this.isLoaded.spInstr[workGroup.assignedSpInstrId]) {
            params.addAssessment = true;
        }

        return this.query.from(resource)
            .using(this.manager)
            .withParameters(params)
            .where(wgPred.and(crsePred))
            .execute()
            .then(activeWgResultResponse)
            .catch(this.queryFailed);
        
        function activeWgResultResponse(data: breeze.QueryResult): Array<ecat.entity.ICrseStudInGroup> {
             const crseStudInGrps = data.results as Array<ecat.entity.ICrseStudInGroup>;
           
             if (!crseStudInGrps || crseStudInGrps.length === 0) {
                const queryError: ecat.IQueryError = {
                    errorMessage: 'No published data was found for this workgroup',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                 that.c.$q.reject(queryError);
             }

            workGroup = crseStudInGrps[0].workGroup;

            if (workGroup.assignedSpInstr) {
                that.isLoaded.spInstr[workGroup.assignedSpInstrId] = true;
             }

            if (workGroup.facSpComments) {
                that.isLoaded.wgFacComment[that.activeGroupId] = true;
            }

            if (workGroup.spComments) {
                that.isLoaded.wgSpComment[that.activeGroupId] = true;
            }

            that.isLoaded.spResult[that.activeGroupId] = true;

            const cachedInventory = that.manager
                .getEntities(_mp.MpEntityType.spInventory) as Array<ecat.entity.IFacSpInventory>;

            cachedInventory
                .filter(inv => inv.instrument.id === workGroup.assignedSpInstrId)
                .forEach(inv => {
                    inv.workGroup = workGroup;
                });

            that.log.info('Fetched course student in groups result from the remote data store', crseStudInGrps, false);
            return crseStudInGrps;
        }      
    }

    getAllActiveWgFacStrat(): Array<ecat.entity.IFacStratResponse> {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }

        const workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        return workGroup.groupMembers.map(gm => {
            const existingStrat = gm.facultyStrat;

            if (existingStrat) {
                return existingStrat;
            }

            return this.manager.createEntity(_mp.MpEntityType.facStratResponse, {
                assesseePersonId: gm.studentId,
                facultyPersonId: this.dCtx.user.persona.personId,
                courseId: this.activeCourseId,
                workGroupId: this.activeGroupId
            }) as ecat.entity.IFacStratResponse;
        });
    }

    getFacSpInventory(assesseeId: number): Array<ecat.entity.IFacSpInventory> {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }

        const workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        if (!workGroup.assignedSpInstr) {
            this.log.warn('Missing an assigned instrument for this workgroup', workGroup, false);
            return null;
        }

        const inventoryList = workGroup.assignedSpInstr.inventoryCollection as Array<ecat.entity.IStudSpInventory>;

        return inventoryList.map((item: ecat.entity.IFacSpInventory) => {
            const key = { assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId, inventoryItemId: item.id };

            let facSpReponse = this.manager.getEntityByKey(_mp.MpEntityType.facSpResponse, [assesseeId, this.activeCourseId, this.activeGroupId, item.id]) as ecat.entity.IFacSpResponse;

            if (!facSpReponse) {
                facSpReponse = this.manager.createEntity(_mp.MpEntityType.facSpResponse, key) as ecat.entity.IFacSpResponse;
                facSpReponse.facultyPersonId = this.dCtx.user.persona.personId;
            }
            //Since we are reusing the inventory item breeze will auto try the backing fields...need to reset them to ensure there is no carryover between assessments;
            item.reset();
            item.responseForAssessee = facSpReponse;

            return item;
        }) as Array<ecat.entity.IFacSpInventory>;

    }

    getFacSpComment(assesseeId: number): ecat.entity.IFacSpComment {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }

        const facComments = this.manager.getEntities(_mp.MpEntityType.facSpComment) as Array<ecat.entity.IFacSpComment>;

        //Faculty comments are not tied to person, so do not search for faculty id when looking for faculty comments!
        let facComment = facComments.filter(comment => comment.recipientPersonId === assesseeId && comment.courseId === this.activeCourseId && comment.workGroupId === this.activeGroupId)[0];

        if (!facComment) {
            facComment = this.manager.createEntity(_mp.MpEntityType.facSpComment, { recipientPersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId }) as ecat.entity.IFacSpComment;

            const commentFlags = this.manager.getEntities(_mp.MpEntityType.facSpCommentFlag) as Array<ecat.entity.IFacSpCommentFlag>;

            let commentFlag = commentFlags.filter(flag => flag.recipientPersonId === assesseeId && flag.courseId === this.activeCourseId && flag.workGroupId === this.activeGroupId)[0];

            if (!commentFlag) {
                commentFlag = this.manager.createEntity(_mp.MpEntityType.facSpCommentFlag, { recipientPersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId }) as ecat.entity.IFacSpCommentFlag;
                commentFlag.mpAuthor = _mp.MpCommentFlag.neut;
            }
        
            facComment.facultyPersonId = this.dCtx.user.persona.personId;
            facComment.flag = commentFlag;
        }

        return facComment;
    }

    getCrseEnrolls(getNew?: boolean): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
        const that = this;
        const resource = this.facultyApiResource.caCourse.resource;
        const log = this.log;
        let course: ecat.entity.ICourse;

        if (this.isLoaded.caCourse[this.activeCourseId] && !getNew) {
            const cachedCaCourse = this.queryLocal(resource) as ecat.entity.ICourse;
            this.log.success('Course loaded from local cache', course, false);
            return this.c.$q.when(course);
        }

        return this.query.from(resource)
            .using(this.manager)
            .withParameters({ courseId: this.activeCourseId })
            //.orderBy(ordering)
            .execute()
            .then(caCoursesReponse)
            .catch(this.queryFailed);

        function caCoursesReponse(data: breeze.QueryResult): ecat.entity.ICourse {
            const caCourse = data.results[0] as ecat.entity.ICourse;

            that.isLoaded.caCourse[caCourse.id] = true;
            log.success('Courses loaded from remote store', data, false);
            //_.activeCourseId = courses[0].id;
            that.isLoaded.crseInitialized = true;
            return caCourse;
        }
    }

    getSingleStrat(studentId: number) {
        
        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupId: this.activeCourseId, courseId: this.activeCourseId }, false);
            return null;
        }

        const existingStrat = this.manager.getEntityByKey(_mp.MpEntityType.facStratResponse, [loggedUserId, studentId, this.activeCourseId, this.activeGroupId]) as ecat.entity.IFacStratResponse;

        return (existingStrat) ? existingStrat :
            this.manager.createEntity(_mp.MpEntityType.facStratResponse, {
                assesseePersonId: studentId,
                facultyPersonId: loggedUserId,
                courseId: this.activeCourseId,
                workGroupId: this.activeGroupId
            }) as ecat.entity.IFacStratResponse;
    }
}