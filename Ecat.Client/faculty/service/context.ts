import IUtilityRepo from 'core/service/data/utility'
import {facCrseStudInGrpCfg}from "faculty/entityExtensions/crseStudentInGroup"
import {facWorkGrpEntityExt} from "faculty/entityExtensions/workgroup"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

interface IFacultyApiResources extends ecat.IApiResources {
    courses: ecat.IApiResource,
    course: ecat.IApiResource,
    wgAssess: ecat.IApiResource,

}

interface ICachcedFacultyData {
    initiailze: boolean;
    course: any;
    workGroup: any;
    spInstr: any;
}

export default class EcFacultyRepo extends IUtilityRepo {
    static serviceId = 'data.faculty';
    static $inject = ['$injector'];

    activeCourseId: number;
    activeGroupId: number;

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
        }
    }

    constructor(inj) {
        super(inj, 'Faculty Data Service', _mp.EcMapApiResource.faculty, [facWorkGrpEntityExt, facCrseStudInGrpCfg]);
        this.loadManager(this.facultyApiResource);
        this.isLoaded.workGroup = {};
        this.isLoaded.course = {};
        this.isLoaded.spInstr = {};
    }

    initializeCourses(forceRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const _ = this;
        const resource = this.facultyApiResource.courses.resource;
        const log = this.log;
        const isLoaded = this.isLoaded as ICachcedFacultyData;
        const ordering = 'course.startDate desc';
        let courses: Array<ecat.entity.ICourse>;
        
        if (isLoaded.initiailze && !forceRefresh) {
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

                if (!facCrse.course.workGroups || facCrse.course.workGroups.length == 0) {
                    return null;
                }

                _.isLoaded.course[facCrse.courseId] = true;
                
                facCrse.course.workGroups.reduce((loadedWg, wg) => {
                    if (wg.groupMembers && wg.groupMembers.length > 0) {
                        loadedWg[wg.id] = true;
                    }
                }, _.isLoaded.workGroup);

            });
            courses = facInCrses.map(facCrse => facCrse.course);
            log.success('Courses loaded from remote store', data, false);
            _.activeCourseId = courses[0].id;
            return courses;
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
     
        if (!isLoaded.spInstr[cachedWg.assignedSpInstrId]) {
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

    getFacSpInventory(assesseeId: number): Array<ecat.entity.IFacSpInventory> {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }

        const instrument = this.manager.getEntityByKey(_mp.EcMapEntityType.spInventory, { courseId: this.activeCourseId, workGroupId: this.activeGroupId }) as ecat.entity.ISpInstrument;

        if (!instrument || !instrument.inventoryCollection) {
            this.log.warn('The instrument and/or inventory is not loaded on client', null, false);
        }

        return instrument.inventoryCollection.map((inventory: ecat.entity.IFacSpInventory) => {
            const key = { assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId, inventoryItemId: inventory.id };

            let facSpReponse = this.manager.getEntityByKey(_mp.EcMapEntityType.facSpResponse, key) as ecat.entity.IFacSpResponse;

            if (!facSpReponse) {
                facSpReponse = this.manager.createEntity(_mp.EcMapEntityType.facSpResponse, key) as ecat.entity.IFacSpResponse;
            }

            inventory.responseForAssessee = facSpReponse;

            return inventory;
        }) as Array<ecat.entity.IFacSpInventory>;

    }

    getFacSpComment(assesseeId: number): ecat.entity.IFacSpComment {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
        }

        const facComments = this.manager.getEntities(_mp.EcMapEntityType.facSpComment) as Array<ecat.entity.IFacSpComment>;

        //Faculty comments are not tied to person, so do not search for faculty id when looking for faculty comments!
        let facComment = facComments.filter(comment => comment.studentPersonId === assesseeId && comment.courseId === this.activeCourseId && comment.workGroupId === this.activeGroupId)[0];

        if (!facComment) {
            facComment = this.manager.createEntity(_mp.EcMapEntityType.facSpComment, { recipientPersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId }) as ecat.entity.IFacSpComment;
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

   
}