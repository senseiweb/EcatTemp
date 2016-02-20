import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'
import MemberInGroup = Ecat.Shared.Model.MemberInGroup;

interface IFaciliatorApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource,
    getGroupById: ecat.IApiResource;
}

export default class EcFacilitatorRepo extends IUtilityRepo {
    static serviceId = 'data.facilitator';
    static $inject = ['$injector'];

    activateCrseMemId: number;
    activeGroupId: number;

    private facilitatorApiResources: IFaciliatorApiResources = {
        initCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetInitalCourses',
                isLoaded: false
            }
        },
        getGroupById: {
            returnedEntityType: this.c.appVar.EcMapEntityType.grpMember,
            resource: {
                name: 'GetWorkGroupData',
                isLoaded: {
                    group: {} as any
                }
            }
        }
    };

    constructor(inj) {
        super(inj, 'Facilitator Data Service', AppVar.EcMapApiResource.facilitator, []);
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


    getNewFacSpAssessResponse(groupId: number, assesseeId: number, inventoryId: number): ecat.entity.IFacSpAssess {

        const newAssessResponse = {
            assesseeId: assesseeId,
            relatedInventoryId: inventoryId,
            assignedGroupId: groupId
        }

        return this.manager.createEntity(AppVar.EcMapEntityType.facSpAssessResponse, newAssessResponse) as ecat.entity.IFacSpAssess;
    }

    getMemberByGroupId(): breeze.promises.IPromise<Array<ecat.entity.IMemberInGroup> | angular.IPromise<void>> {
        let memberInGrps: Array<ecat.entity.IMemberInGroup>;
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
            memberInGrps = this.queryLocal(api.getGroupById.resource.name, null, predicate) as Array<ecat.entity.IMemberInGroup>;
            this.logSuccess(`Loaded workgroup with ID: ${this.activeGroupId} from local cache`, memberInGrps, false);
            return this.c.$q.when(memberInGrps);
        }

        return this.query.from(api.getGroupById.resource.name)
            .where(predicate)
            .using(this.manager)
            .execute()
            .then(getFullGrpByIdResponse)
            .catch(this.queryFailed);

        function getFullGrpByIdResponse(data: breeze.QueryResult): Array<ecat.entity.IMemberInGroup> | angular.IPromise<void> {
            memberInGrps = data.results as Array<ecat.entity.IMemberInGroup>;
            if (memberInGrps.length === 0 ) {
                const qe: ecat.IQueryError = {
                    errorType: self.c.appVar.QueryError.UnexpectedNoResult,
                    errorMessage: 'Expected a result, got nothing!'
                }
                return self.c.$q.reject(qe);
            }
            api.getGroupById.resource.isLoaded.group[self.activeGroupId] = true;
            self.logSuccess(`Loaded workgroup with ID: ${self.activeGroupId} from local cache`, memberInGrps, false);
            return memberInGrps;
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