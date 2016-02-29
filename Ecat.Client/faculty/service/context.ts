import IUtilityRepo from 'core/service/data/utility'
import * as IMemInGrpExt from "core/entityExtension/crseStudentInGroup"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"
import * as IFacWorkGrpExt from "faculty/entityExtensions/workgroup"

interface IFacultyApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource,
    getGroupById: ecat.IApiResource,
    getStudentCapstoneDetails: ecat.IApiResource,
    getGroupCapstoneData: ecat.IApiResource;
}

export default class EcFacultyRepo extends IUtilityRepo {
    static serviceId = 'data.faculty';
    static $inject = ['$injector'];

    activeCourseId: number;
    activeGroupId: number;

    private facilitatorApiResources: IFacultyApiResources = {
        initCourses: {
            returnedEntityType: _mp.EcMapEntityType.faccultyCrseMember,
            resource: 'GetInitalCourses'
        },
        getGroupById: {
            returnedEntityType: _mp.EcMapEntityType.workGroup,
            resource:  'GetWorkGroupData'
            },
        getGroupCapstoneData: {
            returnedEntityType:_mp.EcMapEntityType.faccultyCrseMember,
            resource: 'GetGroupCapstoneData'
        },
        getStudentCapstoneDetails: {
            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
            resource:  'GetStudentCapstoneDetails'
            }
    }

    constructor(inj) {
        super(inj, 'Facilitator Data Service', _mp.EcMapApiResource.faculty, [IFacWorkGrpExt.facWorkGrpEntityExt]);
        this.loadManager(this.facilitatorApiResources);
    }

    initializeCourses(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.IFacInCrse> | angular.IPromise<void>> {
        const api = this.facilitatorApiResources;
        const self = this;

        if (this.isLoaded && !forceRefresh) {
            const courseMems = this.queryLocal(api.initCourses.resource) as Array<ecat.entity.IFacInCrse>;
            this.log.success('Courses loaded from local cache', courseMems, false);
            return this.c.$q.when(courseMems);
        }

        return this.query.from(api.initCourses.resource)
            .using(this.manager)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.IFacInCrse> {
            const crseMems = data.results as Array<ecat.entity.IFacInCrse>;
            crseMems.forEach(crseMem => {
                //if () {
                   // .forEach(grp => {
                        //api.getCourseGroupMembers.resource.isLoaded[grp.id] = true;
                 //   });

                    //api.getCourseGroupMembers.resource.isLoaded[crseMem.courseId] = true;
               // }
            });
            self.log.success('Courses loaded from remote store', crseMems, false);
            return crseMems;
        }
    }

    getFacSpInventory(assesseeId: number): Array<ecat.entity.IFacSpInventory> {
        if (!this.activeGroupId || !this.activeCourseId) {
            this.log.warn('Missing required information', {groupdId: this.activeCourseId, courseId: this.activeCourseId}, false);
        }

        const instrument = this.manager.getEntityByKey(_mp.EcMapEntityType.spInventory, { courseId: this.activeCourseId, workGroupId: this.activeGroupId }) as ecat.entity.ISpInstrument;
        
        if (!instrument || !instrument.inventoryCollection) {
            this.log.warn('The instrument and/or inventory is not loaded on client', null, false);
        } 

        return instrument.inventoryCollection.map((inventory: ecat.entity.IFacSpInventory) => {
            const key = {assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId, inventoryItemId: inventory.id };

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
            this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId}, false);
        }
        const key = { assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId };

        let facStrat = this.manager.getEntityByKey(_mp.EcMapEntityType.facStratResponse, key) as ecat.entity.IFacStratResponse;

        if (!facStrat) {
            facStrat = this.manager.createEntity(_mp.EcMapEntityType.facSpComment, key) as ecat.entity.IFacStratResponse;
        }

        return facStrat;
    }

    //getMemberByGroupId(): breeze.promises.IPromise<ecat.entity.IFacWorkGroup | angular.IPromise<void>> {
    //    let group: ecat.entity.IFacWorkGroup;
    //    const self = this;
    //    const api = this.facilitatorApiResources;
    //    const predicate = new breeze.Predicate('Group.Id', breeze.FilterQueryOp.Equals, this.activeGroupId);
    //    if (this.activeGroupId === null) {
    //        const qe: ecat.IQueryError = {
    //            errorMessage: 'You must have an active group to get by ID',
    //            errorType: .QueryError.MissingParameter
    //        }
    //        return this.c.$q.reject(qe);
    //    }

    //    const isLoaded = api.getGroupById.resource.isLoaded.group[this.activeGroupId];

    //    if (isLoaded) {
    //        group = this.queryLocal(api.getGroupById.resource.name, null, predicate) as ecat.entity.IFacWorkGroup;
    //        this.logSuccess(`Loaded workgroup with ID: ${this.activeGroupId} from local cache`, group, false);
    //        return this.c.$q.when(group);
    //    }

    //    return this.query.from(api.getGroupById.resource.name)
    //        .where(predicate)
    //        .using(this.manager)
    //        .execute()
    //        .then(getFullGrpByIdResponse)
    //        .catch(this.queryFailed);

    //    function getFullGrpByIdResponse(data: breeze.QueryResult): ecat.entity.IFacWorkGroup | angular.IPromise<void> {
    //        group = data.results[0] as ecat.entity.IFacWorkGroup;
    //        if (group === null) {
    //            const qe: ecat.IQueryError = {
    //                errorType: _mpe.QueryError.UnexpectedNoResult,
    //                errorMessage: 'Expected a result, got nothing!'
    //            }
    //            return self.c.$q.reject(qe);
    //        }
    //        api.getGroupById.resource.isLoaded.group[self.activeGroupId] = true;
    //        self.logSuccess(`Loaded workgroup with ID: ${self.activeGroupId} from local cache`, group, false);
    //        return group;
    //    }
    //}

    //getCapstoneData(): breeze.promises.IPromise<Array<ecat.entity.ICourseMember> | angular.IPromise<void>> {
    //    let groupCourseMems: Array<ecat.entity.ICourseMember>;
    //    const self = this;
    //    const api = this.facilitatorApiResources;
    //    const predicate = new breeze.Predicate('Person.Id', breeze.FilterQueryOp.Equals, this.activeGroupId);
    //    if (this.selectedStudentCMId === null) {
    //        const qe: ecat.IQueryError = {
    //            errorMessage: 'You must have a selected student to get by ID',
    //            errorType: _mpe.QueryError.MissingParameter
    //        }
    //        return this.c.$q.reject(qe);
    //    }

    //    const isLoaded = api.getGroupCapstoneData.resource.isLoaded.groupCapstoneData[this.activeGroupId];

    //    if (isLoaded) {
    //        groupCourseMems = this.queryLocal(api.getGroupCapstoneData.resource.name, null, predicate) as Array<ecat.entity.ICourseMember>;
    //        this.logSuccess(`Loaded student data with ID: ${this.activeGroupId} from local cache`, groupCourseMems, false);
    //        return this.c.$q.when(groupCourseMems);
    //    }

    //    return this.query.from(api.getGroupCapstoneData.resource.name)
    //        .where(predicate)
    //        .using(this.manager)
    //        .execute()
    //        .then(getGroupCapstoneResponse)
    //        .catch(this.queryFailed);

    //    function getGroupCapstoneResponse(data: breeze.QueryResult): Array<ecat.entity.ICourseMember> | angular.IPromise<void> {
    //        groupCourseMems = data.results as Array<ecat.entity.ICourseMember>;
    //        if (groupCourseMems === null) {
    //            const qe: ecat.IQueryError = {
    //                errorType: _mpe.QueryError.UnexpectedNoResult,
    //                errorMessage: 'Expected a result, got nothing!'
    //            }
    //            return self.c.$q.reject(qe);
    //        }
    //        api.getGroupCapstoneData.resource.isLoaded.studentGrpMems[self.activeGroupId] = true;
    //        self.logSuccess(`Loaded student details with ID: ${self.activeGroupId}`, groupCourseMems, false);
    //        return groupCourseMems;
    //    }
    //}

    //getStudentCapstoneDetails(): breeze.promises.IPromise<Array<ecat.entity.IMemberInGroup> | angular.IPromise<void>> {
    //    let studentGrpMems: Array<ecat.entity.IMemberInGroup>;
    //    const self = this;
    //    const api = this.facilitatorApiResources;
    //    const predicate = new breeze.Predicate('Person.Id', breeze.FilterQueryOp.Equals, this.selectedStudentCMId);
    //    if (this.selectedStudentCMId === null) {
    //        const qe: ecat.IQueryError = {
    //            errorMessage: 'You must have a selected student to get by ID',
    //            errorType:_mpe.QueryError.MissingParameter
    //        }
    //        return this.c.$q.reject(qe);
    //    }

    //    const isLoaded = api.getStudentCapstoneDetails.resource.isLoaded.studentCrseMem[this.selectedStudentCMId];

    //    if (isLoaded) {
    //        studentGrpMems = this.queryLocal(api.getStudentCapstoneDetails.resource.name, null, predicate) as Array<ecat.entity.IMemberInGroup>;
    //        this.logSuccess(`Loaded student data with ID: ${this.selectedStudentCMId} from local cache`, studentGrpMems, false);
    //        return this.c.$q.when(studentGrpMems);
    //    }

    //    return this.query.from(api.getStudentCapstoneDetails.resource.name)
    //        .where(predicate)
    //        .using(this.manager)
    //        .execute()
    //        .then(getStudentCapstoneResponse)
    //        .catch(this.queryFailed);

    //    function getStudentCapstoneResponse(data: breeze.QueryResult): Array<ecat.entity.IMemberInGroup> | angular.IPromise<void> {
    //        studentGrpMems = data.results as Array<ecat.entity.IMemberInGroup>;
    //        if (studentGrpMems === null) {
    //            const qe: ecat.IQueryError = {
    //                errorType: _mpe.QueryError.UnexpectedNoResult,
    //                errorMessage: 'Expected a result, got nothing!'
    //            }
    //            return self.c.$q.reject(qe);
    //        }
    //        api.getStudentCapstoneDetails.resource.isLoaded.studentGrpMems[self.selectedStudentCMId] = true;
    //        self.logSuccess(`Loaded student details with ID: ${self.selectedStudentCMId}`, studentGrpMems, false);
    //        return studentGrpMems;
    //    }
    //}
}