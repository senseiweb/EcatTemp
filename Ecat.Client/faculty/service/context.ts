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
    caCourses: ecat.IApiResource;
}

interface ICachcedFacultyData {
    initialize: boolean;
    course: any;
    workGroup: any;
    wgComment: any;
    spInstr: any;
    caCourses: any;
}

export default class EcFacultyRepo extends IUtilityRepo {
    static serviceId = 'data.faculty';
    static $inject = ['$injector'];

    activeCourseId: number;
    activeGroupId: number;
    facRepoLoaded: angular.IPromise<any>;

    private facultyApiResource: IFacultyApiResources = {
        courses: {
            returnedEntityType: _mp.EcMapEntityType.facCrseMember,
            resource: 'InitCourses'
        },
        course: {
            returnedEntityType: _mp.EcMapEntityType.facCrseMember,
            resource: 'ActiveCourse'
        },
        wgAssess: {
            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
            resource: 'WorkGroupAssess'
        },
        getStudentCapstoneDetails: {
            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
            resource: 'GetStudentCapstoneDetails'
        },
        wgComment: {
            returnedEntityType: _mp.EcMapEntityType.spComment,
            resource: 'ActiveWgSpComment'
        },
        caCourses: {
            returnedEntityType: _mp.EcMapEntityType.course,
            resource: 'GetAcadCourses'
        }
    }

    constructor(inj) {
        super(inj, 'Faculty Data Service', _mp.EcMapApiResource.faculty, [facSpInventoryCfg, facPersonCfg, facWorkGrpEntityExt, facCrseStudInGrpCfg, facSpCommentCfg, facStratCfg]);
        super.addResources(this.facultyApiResource);
        this.isLoaded.workGroup = {};
        this.isLoaded.wgComment = {}
        this.isLoaded.course = {};
        this.isLoaded.spInstr = {};
	   this.isLoaded.caCourses = {};
        this.isLoaded.initialize = false;
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
        const _ = this;
        const resource = this.facultyApiResource.courses.resource;
        const log = this.log;
        const ordering = 'course.startDate desc';
        let courses: Array<ecat.entity.ICourse>;
        
        if (this.isLoaded.initialize && !forceRefresh) {
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

                _.isLoaded.course[facCrse.courseId] = true;
                
                facCrse.course.workGroups.forEach(wg => {
                    if (wg.groupMembers && wg.groupMembers.length > 0) {
                        _.isLoaded.workGroup[wg.id] = true;
                    }
                });

            });
            courses = facInCrses.map(facCrse => facCrse.course);
            log.success('Courses loaded from remote store', data, false);
            _.activeCourseId = courses[0].id;
            _.isLoaded.initialize = true;
            return courses;
        }
    }

    fetchActiveWgComments(): breeze.promises.IPromise<Array<ecat.entity.IStudSpComment> | angular.IPromise<void>> {
        if (!this.activeGroupId || !this.activeCourseId) {
            return this.c.$q.reject(this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false)) as any;
        }

        const log = this.log;
        const _ = this;
        const resource = this.facultyApiResource.wgComment.resource;
        const wgPred = new breeze.Predicate('workGroupId', breeze.FilterQueryOp.Equals, this.activeGroupId);
        const crsePred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);
        if (this.isLoaded.wgComment[this.activeGroupId]) {
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

            _.isLoaded.wgComment[_.activeGroupId] = true;
            log.success('Retrieved SpComment for local data source', comments, false);
            return comments;
        }
    }

    getActiveCourse(): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {

        const log = this.log;
        const loggedInPersonId = this.dCtx.user.persona.personId;
        const isLoaded = this.isLoaded as ICachcedFacultyData;
        let course: ecat.entity.ICourse;
        
        if (isLoaded.course[this.activeCourseId]) {
            const cachedFacInCourse = this.manager.getEntityByKey(_mp.EcMapEntityType.facCrseMember, [loggedInPersonId, this.activeCourseId]) as ecat.entity.IFacInCrse;
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
               isLoaded.course[course.id] = true;
                course.workGroups.forEach(wg => {
                    if (wg.groupMembers && wg.groupMembers.length > 0) {
                        isLoaded.workGroup[wg.id] = true;
                    }
                });
            }
            log.success('Course loaded from remote store', course, false);
            return course;
        }
    }
    
    getActiveWorkGroup(): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
        const log = this.log;
        const _ = this;
        const loggedInPersonId = this.dCtx.user.persona.personId;
        const isLoaded = this.isLoaded as ICachcedFacultyData;
        let workGroup: ecat.entity.IWorkGroup;
        const cachedWg = this.manager.getEntityByKey(_mp.EcMapEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;
        
        //A loaded workgroup is a group that has group members on the client, not just the workgroup entity.
        if (isLoaded.workGroup[this.activeGroupId]) {
            if (cachedWg) {
               workGroup = cachedWg;
               log.success('WorkGroup loaded from local cache', workGroup, false);
               return this.c.$q.when(workGroup);
            }
        }
                
        const resource = this.facultyApiResource.wgAssess.resource;
        const params = {courseId: this.activeCourseId, workGroupId: this.activeGroupId, addAssessment: false};
     
        if (!cachedWg || !isLoaded.spInstr[cachedWg.assignedSpInstrId]) {
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
            
            _.isLoaded.workGroup[workGroup.id] = true;
            const inventory = workGroup.assignedSpInstr.inventoryCollection;
            
            if (inventory && inventory.length > 0 ) {
                _.isLoaded.spInstr[workGroup.assignedSpInstrId] = true;
            }
            
            log.success('WorkGroup loaded from remote store', workGroup, false);
            return workGroup;
        }
    }

    getAllActiveWgFacStrat(): Array<ecat.entity.IFacStratResponse> {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }

        const workGroup = this.manager.getEntityByKey(_mp.EcMapEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        return workGroup.groupMembers.map(gm => {
            const existingStrat = gm.facultyStrat;

            if (existingStrat) {
                return existingStrat;
            }

            return this.manager.createEntity(_mp.EcMapEntityType.facStratResponse, {
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

        const workGroup = this.manager.getEntityByKey(_mp.EcMapEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        if (!workGroup.assignedSpInstr) {
            this.log.warn('Missing an assigned instrument for this workgroup', workGroup, false);
            return null;
        }

        const inventoryList = workGroup.assignedSpInstr.inventoryCollection as Array<ecat.entity.IStudSpInventory>;

        return inventoryList.map((item: ecat.entity.IFacSpInventory) => {
            const key = { assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId, inventoryItemId: item.id };

            let facSpReponse = this.manager.getEntityByKey(_mp.EcMapEntityType.facSpResponse, [assesseeId, this.activeCourseId, this.activeGroupId, item.id]) as ecat.entity.IFacSpResponse;

            if (!facSpReponse) {
                facSpReponse = this.manager.createEntity(_mp.EcMapEntityType.facSpResponse, key) as ecat.entity.IFacSpResponse;
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

        const facComments = this.manager.getEntities(_mp.EcMapEntityType.facSpComment) as Array<ecat.entity.IFacSpComment>;

        //Faculty comments are not tied to person, so do not search for faculty id when looking for faculty comments!
        let facComment = facComments.filter(comment => comment.recipientPersonId === assesseeId && comment.courseId === this.activeCourseId && comment.workGroupId === this.activeGroupId)[0];

        if (!facComment) {
            facComment = this.manager.createEntity(_mp.EcMapEntityType.facSpComment, { recipientPersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId }) as ecat.entity.IFacSpComment;
            const flag = this.manager.createEntity(_mp.EcMapEntityType.facSpCommentFlag, { recipientPersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId }, breeze.EntityState.Unchanged) as ecat.entity.IFacSpCommentFlag;
            facComment.facultyPersonId = this.dCtx.user.persona.personId;
            facComment.flag = flag;
            facComment.flag.mpFaculty = _mp.MpCommentFlag.neut;
        }

        return facComment;
    }

    getFacStrat(assesseeId: number): ecat.entity.IFacStratResponse {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }
        const key = { assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId };

        let facStrat = this.manager.getEntityByKey(_mp.EcMapEntityType.facStratResponse, key) as ecat.entity.IFacStratResponse;

        if (!facStrat) {
            facStrat = this.manager.createEntity(_mp.EcMapEntityType.facSpComment, key) as ecat.entity.IFacStratResponse;
        }

        return facStrat;
    }

    getAcadCrses(academyId: string, forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        academyId = 'SNCOA/GUNTER';

        const _ = this;
        const resource = this.facultyApiResource.caCourses.resource;
        const log = this.log;
        const ordering = 'course.startDate desc';
        let courses: Array<ecat.entity.ICourse>;

        if (this.isLoaded.caCourses && !forceRefresh) {
            const cachedCaCourses = this.queryLocal(resource) as Array<ecat.entity.ICourse>;
            courses = cachedCaCourses.map(caCourse => caCourse);
            this.log.success('Courses loaded from local cache', courses, false);
            return this.c.$q.when(courses);
        }

        return this.query.from(resource)
            .using(this.manager)
            //.orderBy(ordering)
            .execute()
            .then(caCoursesReponse)
            .catch(this.queryFailed);

        function caCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
            const caCourses = data.results as Array<ecat.entity.ICourse>;

            caCourses.sort((first: ecat.entity.ICourse, second: ecat.entity.ICourse) => {
                if (first.startDate === undefined || first.startDate === null) { return -1 }
                if (first.startDate < second.startDate) { return -1 }
                if (first.startDate > second.startDate) { return 1 }
                if (first.startDate === second.startDate) { return 0 }
            });

            caCourses.forEach(crse => {
                _.isLoaded.caCourses[crse.id] = true;
            });
            courses = caCourses.map(caCourse => caCourse);
            log.success('Courses loaded from remote store', data, false);
            //_.activeCourseId = courses[0].id;
            _.isLoaded.initialize = true;
            return courses;
        }
    }
}