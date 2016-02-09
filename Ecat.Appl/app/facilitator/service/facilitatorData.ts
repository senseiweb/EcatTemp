import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as IGroupMemberExt from "core/config/entityExtension/groupMember"
import * as IGroupExt from "core/config/entityExtension/group"
import * as AppVar from 'appVars'

interface FaciliatorApiResources extends ecat.IApiResources {
    getCourses: ecat.IApiResource,
    getAllGroupData: ecat.IApiResource;
}

export default class EcStudentRepo extends IUtilityRepo {
    static serviceId = 'data.facilitator';
    static $inject = ['$injector'];

    activated = false;
    activeCourse: ecat.entity.ICourseMember;
    private facilitatorApiResources: FaciliatorApiResources = {
        getCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetCourses',
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
        super(inj, 'Facilitator Data Service', AppVar.EcMapApiResource.facilitator, [IGroupMemberExt.groupMemberConfig, IGroupExt.groupConfig]);
        this.loadManager(this.facilitatorApiResources);
    }

    getCourses(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.facilitatorApiResources.getCourses.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getCoursesResponse)
            .catch(this.queryFailed);

        function getCoursesResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got course memberships', retData.results, false);
                self.facilitatorApiResources.getCourses.resource.isLoaded = true;
                return retData.results as ecat.entity.ICourseMember[];
            }
        }
    }

    getAllGroupData(): breeze.promises.IPromise<any> {
        const self = this;
        const res = this.facilitatorApiResources.getAllGroupData.resource.name;
        const logger = this.logInfo;

        return this.query.from(res)
            .using(this.manager)
            .execute()
            .then(getGroupDataResponse)
            .catch(this.queryFailed);

        function getGroupDataResponse(retData: breeze.QueryResult) {
            if (retData.results.length > 0) {
                logger('Got group and assessment data', retData.results, false);
                self.facilitatorApiResources.getAllGroupData.resource.isLoaded = true;
                return retData.results as ecat.entity.IGroupMember[];
            }
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