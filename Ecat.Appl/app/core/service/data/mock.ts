import IUtilityRepo from 'core/service/data/utility'
import * as AppVar from 'appVars'


interface IMockApiResource extends ecat.IApiResources {
    getStudCrse: ecat.IApiResource;
    getStudAssess: ecat.IApiResource;
}

export default class EcMockData extends IUtilityRepo {
    static serviceId = 'data.mock';
    static $inject = ['$injector'];

    activated = false;
    activeCourse: ecat.entity.ICourseMember;
    private mockApiResources: IMockApiResource = {
        getStudCrse: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetStudentCourses',
                isLoaded: false
            }
        },
        getStudAssess: {
            returnedEntityType: this.c.appVar.EcMapEntityType.grpMember,
            resource: {
                name: 'GetStudentAssessment',
                isLoaded: false  
            }
        }
    };

    constructor(inj) {
        super(inj, 'Mock Data Service', AppVar.EcMapApiResource.mock, []);
        this.loadManager(this.mockApiResources);
    }

    getCourses(): breeze.promises.IPromise<Array<ecat.entity.ICourseMember> | angular.IPromise<void>> {
        const self = this;
        const resource = this.mockApiResources.getStudCrse.resource;

        if (resource.isLoaded) {
            return this.c.$q.when(this.queryLocal(resource.name) as  Array<ecat.entity.ICourseMember>);
        }

        return this.query.from(resource.name)
            .withParameters({ studentId: this.dCtx.user.persona.personId })
            .using(this.manager)
            .execute()
            .then(getCourseSuccess)
            .catch(this.queryFailed);

        function getCourseSuccess(data: breeze.QueryResult): Array<ecat.entity.ICourseMember> {
            if (data.results.length === 0) {
                return null;
            }

            const courseMember = data.results as Array<ecat.entity.ICourseMember>;
            resource.isLoaded = true;
            self.activeCourse = courseMember[0];
            self.getStudAssessment();
            return courseMember;
        }
    }

    getStudAssessment(): breeze.promises.IPromise<Array<ecat.entity.IGroupMember> | angular.IPromise<void>> {
        const self = this;
        const resource = this.mockApiResources.getStudAssess.resource;

        if (resource.isLoaded) {
            return this.c.$q.when(this.queryLocal(resource.name) as Array<ecat.entity.IGroupMember>);
        }

        return this.query.from(resource.name)
            .withParameters({ courseMemberId: this.activeCourse.id})
            .using(this.manager)
            .execute()
            .then(getStudAsessSuccess)
            .catch(this.queryFailed);

        function getStudAsessSuccess(data: breeze.QueryResult): Array<ecat.entity.IGroupMember> {
            if (data.results.length === 0) {
                return null;
            }
            const groupMembers = data.results as Array<ecat.entity.IGroupMember>;
            resource.isLoaded = true;
            console.log(groupMembers);
            return groupMembers;
        }
    }

    
    
}