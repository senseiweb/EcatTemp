import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as IMemInGrpExt from "core/config/entityExtension/memberInGroup"
import * as AppVar from 'appVars'
import * as IFacWorkGrpExt from "facilitator/config/entityExtension/workGroup"
import MemberInGroup = Ecat.Shared.Model.MemberInGroup;
import WorkGroup = Ecat.Shared.Model.WorkGroup;

interface IFaciliatorApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource,
    getGroupById: ecat.IApiResource,
    getStudentCapstoneDetails: ecat.IApiResource,
    getGroupCapstoneData: ecat.IApiResource
}

export default class EcFacilitatorRepo extends IUtilityRepo {
    static serviceId = 'data.facilitator';
    static $inject = ['$injector'];

    activateCrseMemId: number;
    activeGroupId: number;
    selectedStudentCMId: number;

    private facilitatorApiResources: IFaciliatorApiResources = {
        initCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetInitalCourses',
                isLoaded: false
            }
        },
        getGroupById: {
            returnedEntityType: this.c.appVar.EcMapEntityType.group,
            resource: {
                name: 'GetWorkGroupData',
                isLoaded: {
                    group: {} as any
                }
            }
        },
        getGroupCapstoneData: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetGroupCapstoneData',
                isLoaded: {
                    name: 'GetGroupCapstoneData',
                    isLoaded: false
                }
            }
        },
        getStudentCapstoneDetails: {
            returnedEntityType: this.c.appVar.EcMapEntityType.grpMember,
            resource: {
                name: 'GetStudentCapstoneDetails',
                isLoaded: false
            }
        }
    };

    constructor(inj) {
        super(inj, 'Facilitator Data Service', AppVar.EcMapApiResource.facilitator, [IFacWorkGrpExt.facWorkGrpEntityExt]);
        this.loadManager(this.facilitatorApiResources);
    }

    initializeCourses(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourseMember> | angular.IPromise<void>> {
        const api = this.facilitatorApiResources;
        const self = this;

        if (api.initCourses.resource.isLoaded && !forceRefresh) {
            const courseMems = this.queryLocal(api.initCourses.resource.name) as Array<ecat.entity.ICourseMember>;
            this.logSuccess('Courses loaded from local cache', courseMems, false);
            return this.c.$q.when(courseMems);
        }

        return this.query.from(api.initCourses.resource.name)
            .using(this.manager)
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourseMember> {
            const crseMems = data.results as Array<ecat.entity.ICourseMember>;
            crseMems.forEach(crseMem => {
                if (crseMem.studGroupEnrollments) {
                    crseMem.studGroupEnrollments.forEach(grp => {
                        //api.getCourseGroupMembers.resource.isLoaded[grp.id] = true;
                    });

                    //api.getCourseGroupMembers.resource.isLoaded[crseMem.courseId] = true;
                }
            });
            self.logSuccess('Courses loaded from remote store', crseMems, false);
            return crseMems;
        }
    }


    getNewFacSpAssessResponse(group: ecat.entity.IFacWorkGroup, assessee: ecat.entity.IMemberInGroup, inventory: Ecat.Shared.Model.SpInventory): ecat.entity.IFacSpAssess {
        const newAssessResponse = {
            assessee: assessee,
            inventoryItem: inventory,
            assignedGroup: group
        }

        return this.manager.createEntity(AppVar.EcMapEntityType.facSpAssessResponse, newAssessResponse) as ecat.entity.IFacSpAssess;
    }

    getNewFacComment(group: ecat.entity.IFacWorkGroup, recipient: ecat.entity.IMemberInGroup): ecat.entity.IFacSpComment {
        const newFacComment = {
            assignedGroup: group,
            recipient: recipient
        }

        return this.manager.createEntity(AppVar.EcMapEntityType.facSpComment, newFacComment) as ecat.entity.IFacSpComment;
    }

    getNewFacStrat(group: ecat.entity.IFacWorkGroup, assessee: ecat.entity.IMemberInGroup): ecat.entity.IFacSpStratResponse {
        const newFacStrat = {
            assignedGroup: group,
            assessee: assessee
        }

        return this.manager.createEntity(AppVar.EcMapEntityType.facSpStratResponse, newFacStrat) as ecat.entity.IFacSpStratResponse;
    }

    getMemberByGroupId(): breeze.promises.IPromise<ecat.entity.IFacWorkGroup | angular.IPromise<void>> {
        let group: ecat.entity.IFacWorkGroup;
        const self = this;
        const api = this.facilitatorApiResources;
        const predicate = new breeze.Predicate('Group.Id', breeze.FilterQueryOp.Equals, this.activeGroupId);
        if (this.activeGroupId === null) {
            const qe: ecat.IQueryError = {
                errorMessage: 'You must have an active group to get by ID',
                errorType: this.c.appVar.QueryError.MissingParameter
            }
            return this.c.$q.reject(qe);
        }

        const isLoaded = api.getGroupById.resource.isLoaded.group[this.activeGroupId];

        if (isLoaded) {
            group = this.queryLocal(api.getGroupById.resource.name, null, predicate) as ecat.entity.IFacWorkGroup;
            this.logSuccess(`Loaded workgroup with ID: ${this.activeGroupId} from local cache`, group, false);
            return this.c.$q.when(group);
        }

        return this.query.from(api.getGroupById.resource.name)
            .where(predicate)
            .using(this.manager)
            .execute()
            .then(getFullGrpByIdResponse)
            .catch(this.queryFailed);

        function getFullGrpByIdResponse(data: breeze.QueryResult): ecat.entity.IFacWorkGroup | angular.IPromise<void> {
            group = data.results[0] as ecat.entity.IFacWorkGroup;
            if (group === null) {
                const qe: ecat.IQueryError = {
                    errorType: self.c.appVar.QueryError.UnexpectedNoResult,
                    errorMessage: 'Expected a result, got nothing!'
                }
                return self.c.$q.reject(qe);
            }
            api.getGroupById.resource.isLoaded.group[self.activeGroupId] = true;
            self.logSuccess(`Loaded workgroup with ID: ${self.activeGroupId} from local cache`, group, false);
            return group;
        }
    }

    getCapstoneData(): breeze.promises.IPromise<Array<ecat.entity.ICourseMember> | angular.IPromise<void>> {
        let groupCourseMems: Array<ecat.entity.ICourseMember>;
        const self = this;
        const api = this.facilitatorApiResources;
        const predicate = new breeze.Predicate('Person.Id', breeze.FilterQueryOp.Equals, this.activeGroupId);
        if (this.selectedStudentCMId === null) {
            const qe: ecat.IQueryError = {
                errorMessage: 'You must have a selected student to get by ID',
                errorType: this.c.appVar.QueryError.MissingParameter
            }
            return this.c.$q.reject(qe);
        }

        const isLoaded = api.getGroupCapstoneData.resource.isLoaded.groupCapstoneData[this.activeGroupId];

        if (isLoaded) {
            groupCourseMems = this.queryLocal(api.getGroupCapstoneData.resource.name, null, predicate) as Array<ecat.entity.ICourseMember>;
            this.logSuccess(`Loaded student data with ID: ${this.activeGroupId} from local cache`, groupCourseMems, false);
            return this.c.$q.when(groupCourseMems);
        }

        return this.query.from(api.getGroupCapstoneData.resource.name)
            .where(predicate)
            .using(this.manager)
            .execute()
            .then(getGroupCapstoneResponse)
            .catch(this.queryFailed);

        function getGroupCapstoneResponse(data: breeze.QueryResult): Array<ecat.entity.ICourseMember> | angular.IPromise<void> {
            groupCourseMems = data.results as Array<ecat.entity.ICourseMember>;
            if (groupCourseMems === null) {
                const qe: ecat.IQueryError = {
                    errorType: self.c.appVar.QueryError.UnexpectedNoResult,
                    errorMessage: 'Expected a result, got nothing!'
                }
                return self.c.$q.reject(qe);
            }
            api.getGroupCapstoneData.resource.isLoaded.studentGrpMems[self.activeGroupId] = true;
            self.logSuccess(`Loaded student details with ID: ${self.activeGroupId}`, groupCourseMems, false);
            return groupCourseMems;
        }
    }

    getStudentCapstoneDetails(): breeze.promises.IPromise<Array<ecat.entity.IMemberInGroup> | angular.IPromise<void>> {
        let studentGrpMems: Array<ecat.entity.IMemberInGroup>;
        const self = this;
        const api = this.facilitatorApiResources;
        const predicate = new breeze.Predicate('Person.Id', breeze.FilterQueryOp.Equals, this.selectedStudentCMId);
        if (this.selectedStudentCMId === null) {
            const qe: ecat.IQueryError = {
                errorMessage: 'You must have a selected student to get by ID',
                errorType: this.c.appVar.QueryError.MissingParameter
            }
            return this.c.$q.reject(qe);
        }

        const isLoaded = api.getStudentCapstoneDetails.resource.isLoaded.studentCrseMem[this.selectedStudentCMId];

        if (isLoaded) {
            studentGrpMems = this.queryLocal(api.getStudentCapstoneDetails.resource.name, null, predicate) as Array<ecat.entity.IMemberInGroup>;
            this.logSuccess(`Loaded student data with ID: ${this.selectedStudentCMId} from local cache`, studentGrpMems, false);
            return this.c.$q.when(studentGrpMems);
        }

        return this.query.from(api.getStudentCapstoneDetails.resource.name)
            .where(predicate)
            .using(this.manager)
            .execute()
            .then(getStudentCapstoneResponse)
            .catch(this.queryFailed);

        function getStudentCapstoneResponse(data: breeze.QueryResult): Array<ecat.entity.IMemberInGroup> | angular.IPromise<void> {
            studentGrpMems = data.results as Array<ecat.entity.IMemberInGroup>;
            if (studentGrpMems === null) {
                const qe: ecat.IQueryError = {
                    errorType: self.c.appVar.QueryError.UnexpectedNoResult,
                    errorMessage: 'Expected a result, got nothing!'
                }
                return self.c.$q.reject(qe);
            }
            api.getStudentCapstoneDetails.resource.isLoaded.studentGrpMems[self.selectedStudentCMId] = true;
            self.logSuccess(`Loaded student details with ID: ${self.selectedStudentCMId}`, studentGrpMems, false);
            return studentGrpMems;            
        }
    }

   loadFacilitatorManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.facilitatorApiResources)
            .then(() => {
                this.registerTypes(this.facilitatorApiResources);
            })
            .catch(this.queryFailed);
    }
}