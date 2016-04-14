import IUtilityRepo from 'core/service/data/utility'
import ICrseAdminCtx from "faculty/service/lmsAdminCtx"
import {facCrseStudInGrpCfg}from 'faculty/entityExtensions/crseStudentInGroup'
import {facWorkGrpEntityExt} from 'faculty/entityExtensions/workgroup'
import {facPersonCfg} from 'faculty/entityExtensions/person'
import {facSpInventoryCfg} from "faculty/entityExtensions/spInventory"
import {facSpCommentCfg} from "faculty/entityExtensions/spComment"
import {facStratCfg} from "faculty/entityExtensions/facStratResponse"
import * as _mp from 'core/common/mapStrings'
import * as _mpe from 'core/common/mapEnum'

interface IFacultyApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource;
    course: ecat.IApiResource;
    workGroup: ecat.IApiResource;
    instrument: ecat.IApiResource;
    wgComment: ecat.IApiResource;
    wgResult: ecat.IApiResource;
}


export default class EcFacultyRepo extends IUtilityRepo {
    static serviceId = 'data.faculty';
    static $inject = ['$injector'];

    activeCourseId: number;
    activeGroupId: number;
    facRepoLoaded: angular.IPromise<any>;
    isLoaded = {
        initCourses: false,
        course: {},
        workGroup: {},
        wgSpComment: {},
        wgFacComment:{},
        instrument: {},
        wgResult: {}
    }

    private facultyApiResource: IFacultyApiResources = {
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
        instrument: {
            returnedEntityType: _mp.MpEntityType.spInstr,
            resource: 'SpInstrument'
        },
        wgComment: {
            returnedEntityType: _mp.MpEntityType.spComment,
            resource: 'ActiveWgSpComment'
        },
        wgFacComment: {
            returnedEntityType: _mp.MpEntityType.facSpComment,
            resource: 'ActiveWgFacComment'
        },
        wgResult: {
            returnedEntityType: _mp.MpEntityType.workGroup,
            resource: 'ActiveWgSpResult'
        }
    }

    constructor(inj: angular.auto.IInjectorService) {

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

    fetchActiveCourse(forceRefresh?: boolean): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
        const that = this;
        let course: ecat.entity.ICourse;

        if (this.isLoaded.course[this.activeCourseId]) {
            if (!this.activeCourseId) {
                this.log.warn('Not active course selected!', null, true);
                return this.c.$q.reject(() => {
                    return 'A course must be selected';
                });;
            }

           course = this.manager.getEntityByKey(_mp.MpEntityType.course, that.activeCourseId) as ecat.entity.ICourse;

           if (course && !forceRefresh) {
                that.log.success('Course loaded from local cache', course, false);
                return this.c.$q.when(course);
            }
        }

        const resource = this.facultyApiResource.course.resource;
        return this.query.from(resource)
            .using(this.manager)
            .withParameters({ courseId: this.activeCourseId })
            .execute()
            .then(fetchActiveCourseResponse)
            .catch(this.queryFailed);

        function fetchActiveCourseResponse(data: breeze.QueryResult): ecat.entity.ICourse {
            course = data.results[0] as ecat.entity.ICourse;

            if (!course) {
                const error: ecat.IQueryError = {
                    errorMessage: 'An active course was not received from the server.',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                that.log.warn('Query succeeded, but the course membership did not return a result', data, false);
                return that.c.$q.reject(error) as any;
            }

            const workGroups = course.workGroups;

            if (workGroups && workGroups.length > 0) {
                that.isLoaded.course[course.id] = true;
            }

            that.log.success('Course loaded from remote store', course, false);

            return course;
        }
    }

    fetchActiveWorkGroup(forceRefresh?: boolean): breeze.promises.IPromise<ecat.entity.IWorkGroup | angular.IPromise<void>> {
        const that = this;
        let workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        //A loaded workgroup is a group that has group members on the client, not just the workgroup entity.
        if (this.isLoaded.workGroup[this.activeGroupId] && !forceRefresh) {
            if (workGroup) {
                this.log.success('WorkGroup loaded from local cache', workGroup, false);
                return this.c.$q.when(workGroup);
            }
        }

        const api = this.facultyApiResource;

       const query = this.query.from(api.workGroup.resource)
            .using(this.manager)
            .withParameters({ courseId: this.activeCourseId, workGroupId: this.activeGroupId })
            .execute()
            .then(getActiveWorkGroupResponse)
            .catch(this.queryFailed);

        function getActiveWorkGroupResponse(data: breeze.QueryResult): ecat.entity.IWorkGroup {
            workGroup = data.results[0] as ecat.entity.IWorkGroup;
            if (workGroup.groupMembers.length === 0) {
                const queryError: ecat.IQueryError = {
                    errorMessage: 'The active workgroup did not return any results',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                return that.c.$q.reject(queryError) as any;
            }

            that.isLoaded.workGroup[workGroup.workGroupId] = true;
            that.log.success('WorkGroup loaded from remote store', workGroup, false);
            workGroup['remote'] = moment(Date.now());
            return workGroup;
       }

        const promise1 = query;
        const promise2 = this.fetchSpInstrument(workGroup.assignedSpInstrId, forceRefresh);
        return this.c.$q.all([promise1, promise2]).then((resultArray: any) => resultArray[0]);
    }

    fetchActiveWgSpComments(forceRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.IStudSpComment> | angular.IPromise<void>> {
        if (!this.activeGroupId || !this.activeCourseId) {
            return this.c.$q.reject(this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false)) as any;
        }
        const that = this;
        let spComments: Array<ecat.entity.IStudSpComment>;

        if (this.isLoaded.wgSpComment[this.activeGroupId] && !forceRefresh) {
            const allCachedComments = this.manager.getEntities(_mp.MpEntityType.spComment) as Array<ecat.entity.IStudSpComment>;

            spComments = allCachedComments.filter(comment => comment.courseId === this.activeCourseId && comment.workGroupId === this.activeGroupId);

            if (spComments && spComments.length > 0) {
                this.log.success('Retrieved SpComments from local cache', spComments, false);
                return this.c.$q.when(spComments);
            }
        }
        const api = this.facultyApiResource;

        return this.query.from(api.wgComment.resource)
            .withParameters({courseId: this.activeCourseId, workGroupId: this.activeGroupId})
            .using(this.manager)
            .execute()
            .then(fetchActiveWgCommentsResponse)
            .catch(this.queryFailed);

        function fetchActiveWgCommentsResponse(data: breeze.QueryResult): Array<ecat.entity.IStudSpComment> {
             spComments = data.results as Array<ecat.entity.IStudSpComment>;
             if (!spComments || spComments.length === 0) {
                return null;
            }

            that.isLoaded.wgSpComment[that.activeGroupId] = true;
            that.log.success('Retrieved SpComment for local data source', spComments, false);
            return spComments;
        }
    }

    fetchActiveWgFacComments(forceRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.IFacSpComment> | angular.IPromise<void>> {
        if (!this.activeGroupId || !this.activeCourseId) {
            return this.c.$q.reject(this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false)) as any;
        }
        const that = this;
        let facComments: Array<ecat.entity.IFacSpComment>;

        if (this.isLoaded.wgFacComment[this.activeGroupId] && !forceRefresh) {
            const allFacComments = this.manager.getEntities(_mp.MpEntityType.facSpComment) as Array<ecat.entity.IFacSpComment>;

            facComments = allFacComments.filter(comment => comment.courseId === this.activeCourseId && comment.workGroupId === this.activeGroupId);

            if (facComments && facComments.length > 0) {
                this.log.success('Retrieved SpComments from local cache', facComments, false);
                return this.c.$q.when(facComments);
            }
        }
        const api = this.facultyApiResource;

        return this.query.from(api.wgComment.resource)
            .withParameters({ courseId: this.activeCourseId, workGroupId: this.activeGroupId })
            .using(this.manager)
            .execute()
            .then(fetchActiveWgFacCommentResponse)
            .catch(this.queryFailed);

        function fetchActiveWgFacCommentResponse(data: breeze.QueryResult): Array<ecat.entity.IFacSpComment> {
            facComments = data.results as Array<ecat.entity.IFacSpComment>;
            if (!facComments || facComments.length === 0) {
                return null;
            }

            that.isLoaded.wgFacComment[that.activeGroupId] = true;
            that.log.success('Retrieved SpComment for local data source', facComments, false);
            return facComments;
        }
    }

    fetchGrpMemsWithSpResults(forcedRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.ICrseStudInGroup> | angular.IPromise<void>> {
        const that = this;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
            return this.c.$q.reject('Missing result id information') as any;
        }

        let workGroup = this.manager.getEntityByKey(_mp.MpEntityType.workGroup, this.activeGroupId) as ecat.entity.IWorkGroup;

        if (this.isLoaded.wgResult[this.activeGroupId] && !forcedRefresh) {
            const resultCached = this.manager.getEntities(_mp.MpEntityType.crseStudInGrp) as Array<ecat.entity.ICrseStudInGroup>;
            if (resultCached) {
                const members = resultCached.filter(gm => gm.workGroupId === this.activeGroupId && gm.courseId === this.activeCourseId);
                if (members && members.length !== 0) {
                    const cachedInstrumet = that.manager.getEntityByKey(_mp.MpEntityType.spInstr, workGroup.assignedSpInstrId) as ecat.entity.ISpInstrument;
                    const cachedInventory = cachedInstrumet.inventoryCollection as Array<ecat.entity.IFacSpInventory>;
                    cachedInventory
                        .forEach(inv => {
                            inv.resetResults();
                            inv.workGroup = workGroup;
                        });
                    this.log.info('Retrieved workgroup result from the local cache', resultCached, false);
                    return this.c.$q.when(members);
                }
            }
        }

        const api = this.facultyApiResource;
  
        const query =  this.query.from(api.wgResult.resource)
            .using(this.manager)
            .withParameters({courseId: this.activeCourseId, workGroupId: this.activeGroupId})
            .execute()
            .then(activeWgResultResponse)
            .catch(this.queryFailed);
        
        function activeWgResultResponse(data: breeze.QueryResult): Array<ecat.entity.ICrseStudInGroup> {
             workGroup = data.results[0] as ecat.entity.IWorkGroup;
           
             if (!workGroup.groupMembers || workGroup.groupMembers.length === 0) {
                const queryError: ecat.IQueryError = {
                    errorMessage: 'No published data was found for this workgroup',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                 that.c.$q.reject(queryError);
             }

            that.isLoaded.wgResult[that.activeGroupId] = true;

            that.log.info('Fetched course student in groups result from the remote data store', workGroup.groupMembers, false);
            return workGroup.groupMembers;
        }

        const promise1 = query;
        const promise2 = this.fetchSpInstrument(workGroup.assignedSpInstrId, forcedRefresh);
        const promise3 = this.fetchActiveWgSpComments(forcedRefresh);
        const promise4 = this.fetchActiveWgFacComments(forcedRefresh);
        return this.c.$q.all([promise1, promise2, promise3, promise4]).then((results: Array<any>) => {
            const instrument = results[1] as ecat.entity.ISpInstrument;
            const inventory = instrument.inventoryCollection as Array<ecat.entity.IFacSpInventory>;
            inventory
                .forEach(inv => {
                    inv.resetResults();
                    inv.workGroup = workGroup;
                });
            return results[0];
        });
    }

    fetchSpInstrument(instrumentId: number, forceRefresh?: boolean): breeze.promises.IPromise<ecat.entity.ISpInstrument | angular.IPromise<void>> {
        const that = this;
        let instrument: ecat.entity.ISpInstrument;

        if (this.isLoaded.instrument[instrumentId]) {
            instrument = this.manager.getEntityByKey(_mp.MpEntityType.spInstr, instrumentId) as ecat.entity.ISpInstrument;
            this.log.success('Course loaded from local cache', instrument, false);
            return this.c.$q.when(instrument);
        }
        const api = this.facultyApiResource;

        return this.query.from(api.instrument.resource)
            .using(this.manager)
            .withParameters({ instrumentId: instrumentId })
            .execute()
            .then(fetchActiveCrseReponse)
            .catch(this.queryFailed);

        function fetchActiveCrseReponse(data: breeze.QueryResult) {

            instrument = data.results[0] as ecat.entity.ISpInstrument;

            if (!instrument) {
                const error: ecat.IQueryError = {
                    errorMessage: 'An active instrument was not received from the server.',
                    errorType: _mpe.QueryError.UnexpectedNoResult
                }
                that.log.warn('Query succeeded, but the course membership did not return a result', data, false);
                return that.c.$q.reject(error) as any;
            }

            if (instrument.inventoryCollection && instrument.inventoryCollection.length > 0) {
                that.isLoaded.instrument[instrumentId] = true;
            }
            that.log.success('Course loaded from remote data store', instrument, false);
            return instrument;
        }
    }

    getActiveWgMembers(): Array<ecat.entity.ICrseStudInGroup> {
        const cachedGroupMembers = this.manager.getEntities(_mp.MpEntityType.crseStudInGrp) as Array<ecat.entity.ICrseStudInGroup>;
        return cachedGroupMembers.filter(gm => gm.courseId === this.activeCourseId && gm.workGroupId === this.activeGroupId);
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
            item.resetAssess();
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

    //getCrseEnrolls(getNew?: boolean): breeze.promises.IPromise<ecat.entity.ICourse | angular.IPromise<void>> {
    //    const that = this;
    //    const resource = this.facultyApiResource.caCourse.resource;
    //    const log = this.log;
    //    let course: ecat.entity.ICourse;

    //    if (this.isLoaded.caCourse[this.activeCourseId] && !getNew) {
    //        const cachedCaCourse = this.queryLocal(resource) as ecat.entity.ICourse;
    //        this.log.success('Course loaded from local cache', course, false);
    //        return this.c.$q.when(course);
    //    }

    //    return this.query.from(resource)
    //        .using(this.manager)
    //        .withParameters({ courseId: this.activeCourseId })
    //        //.orderBy(ordering)
    //        .execute()
    //        .then(caCoursesReponse)
    //        .catch(this.queryFailed);

    //    function caCoursesReponse(data: breeze.QueryResult): ecat.entity.ICourse {
    //        const caCourse = data.results[0] as ecat.entity.ICourse;

    //        that.isLoaded.caCourse[caCourse.id] = true;
    //        log.success('Courses loaded from remote store', data, false);
    //        //_.activeCourseId = courses[0].id;
    //        that.isLoaded.crseInitialized = true;
    //        return caCourse;
    //    }
    //}

    getSingleStrat(studentId: number) {
        
        const loggedUserId = this.dCtx.user.persona.personId;

        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', { groupId: this.activeCourseId, courseId: this.activeCourseId }, false);
            return null;
        }

        const existingStrat = this.manager.getEntityByKey(_mp.MpEntityType.facStratResponse, [studentId, this.activeCourseId, this.activeGroupId]) as ecat.entity.IFacStratResponse;

        return (existingStrat) ? existingStrat :
            this.manager.createEntity(_mp.MpEntityType.facStratResponse, {
                assesseePersonId: studentId,
                facultyPersonId: loggedUserId,
                courseId: this.activeCourseId,
                workGroupId: this.activeGroupId
            }) as ecat.entity.IFacStratResponse;
    }

    initFacCourses(forceRefresh?: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourse> | angular.IPromise<void>> {
        const that = this;
        const log = this.log;
        let courses: Array<ecat.entity.ICourse>;

        if (this.isLoaded.initCourses && !forceRefresh) {
            courses = this.manager.getEntities(_mp.MpEntityType.course) as Array<ecat.entity.ICourse>;
            this.log.success('Courses loaded from local cache', courses, false);
            return this.c.$q.when(courses);
        }
        const api = this.facultyApiResource;

        return this.query.from(api.initCourses.resource)
            .using(this.manager)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourse> {
            courses = data.results as Array<ecat.entity.ICourse>;
            that.isLoaded.initCourses = courses.length > 0;

            courses.forEach(course => {
                const workGroups = course.workGroups;
                if (workGroups && workGroups.length > 0) {
                    that.isLoaded.course[course.id] = true;
                }
            });
            log.success('Courses loaded from remote store', courses, false);
            return courses;
        }
    }
}