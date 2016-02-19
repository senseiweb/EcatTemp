import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as IGroupMemberExt from "core/config/entityExtension/groupMember"
//import * as IGroupExt from "core/config/entityExtension/group"
import * as AppVar from 'appVars'

interface IFaciliatorApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource,
    getAllGroupData: ecat.IApiResource;
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
        getAllGroupData: {
            returnedEntityType: this.c.appVar.EcMapEntityType.grpMember,
            resource: {
                name: 'GetAllGroupData',
                isLoaded: false
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

   loadFacilitatorManager(): breeze.promises.IPromise<boolean | angular.IPromise<void>> {
        return this.loadManager(this.facilitatorApiResources)
            .then(() => {
                this.registerTypes(this.facilitatorApiResources);
            })
            .catch(this.queryFailed);
    }
}