import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'

interface IStudentApiResources extends ecat.IApiResources {
    initCourses: ecat.IApiResource;
    getCourseGroupMembers: ecat.IApiResource;
    getGroupMembers: ecat.IApiResource;
}

export default class EcStudentRepo extends IUtilityRepo {
    static serviceId = 'data.student';
    static $inject = ['$injector'];

    activated = false;
    activeCrseMemId: number;
    activeGrpMemId: number;

    private studentApiResources: IStudentApiResources = {
        initCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetInitalCourses',
                isLoaded: false
            }
        },
        getCourseGroupMembers: {
            returnedEntityType: this.c.appVar.EcMapEntityType.crseMember,
            resource: {
                name: 'GetCrseGrpMembers',
                isLoaded: {
                    course: {} as any
                }
            }
        },
        getGroupMembers: {
            returnedEntityType: this.c.appVar.EcMapEntityType.grpMember,
            resource: {
                name: 'GetGrpMember',
                isLoaded: {
                    group: {} as any
                }
            }
        }
    };

    constructor(inj) {
        super(inj, 'Student Data Service', AppVar.EcMapApiResource.student, []);
        this.loadManager(this.studentApiResources);
    }

    initCourses(forceRefresh: boolean): breeze.promises.IPromise<Array<ecat.entity.ICourseMember> | angular.IPromise<void>> {
        const api = this.studentApiResources;
        const self = this;

        if (api.initCourses.resource.isLoaded && !forceRefresh) {
            const courseMems = this.queryLocal(api.initCourses.resource.name) as Array<ecat.entity.ICourseMember>;
            this.logSuccess('Courses loaded from local cache', courseMems, false);
            return this.c.$q.when(courseMems);
        }

        return this.query.from(api.initCourses.resource.name)
            .using(this.manager)
            .orderBy('course.startDate desc')
            .execute()
            .then(initCoursesReponse)
            .catch(this.queryFailed);

        function initCoursesReponse(data: breeze.QueryResult): Array<ecat.entity.ICourseMember> {
            const crseMems = data.results as Array<ecat.entity.ICourseMember>;
            crseMems.forEach(crseMem => {
                if (crseMem.studGroupEnrollments) {
                    crseMem.studGroupEnrollments.forEach(grp => {
                        api.getCourseGroupMembers.resource.isLoaded[grp.id] = true;
                    });

                    api.getCourseGroupMembers.resource.isLoaded[crseMem.courseId] = true;
                }
            });
            self.logSuccess('Courses loaded from remote store', crseMems, false);
            return crseMems;
        }
    }

    /**
     * @desc  Gets the active course membership with course and group membership for the latest join workgroup, i.e. BC4.
     */
    getCourseGroupMembers(): breeze.promises.IPromise<ecat.entity.ICourseMember | angular.IPromise<void>> {
        if (!this.activeCrseMemId) {
            this.c.$q.reject(() => {
                this.logWarn('Not active course selected!', null, false);
                return 'A course must be selected';
            });
        }

        const self = this;
        let crseMem: ecat.entity.ICourseMember = null;
        const api = this.studentApiResources;
        const isLoaded = api.getCourseGroupMembers.resource.isLoaded.course;

        if (isLoaded[this.activeCrseMemId]) {
            const pred = new breeze.Predicate('id', breeze.FilterQueryOp.Equals, this.activeCrseMemId);

            crseMem = this.queryLocal(api.getCourseGroupMembers.resource.name, null, pred) as ecat.entity.ICourseMember;
            this.logSuccess('Course loaded from local cache', crseMem, false);
            return this.c.$q.when(crseMem);
        }

        return this.query.from(api.getCourseGroupMembers.resource.name)
            .using(this.manager)
            .withParameters({ crseMemId: this.activeCrseMemId})
            .execute()
            .then(getCoursesResponse)
            .catch(this.queryFailed);

        function getCoursesResponse(data: breeze.QueryResult) {

            crseMem = data.results[0] as ecat.entity.ICourseMember;
            
            if (!crseMem) {
                return self.c.$q.reject(() => self.logWarn('Query succeeded, but the course membership did not return a result', data, false)) as any;
            }

            if (crseMem.studGroupEnrollments) {
                const grpLoaded = api.getGroupMembers.resource.isLoaded.group;
                crseMem.studGroupEnrollments.forEach(grpMem => {
                    grpLoaded[grpMem.id] = true;
                });
            }

            return crseMem;
        }
    }

    getGroupMembers(): breeze.promises.IPromise<ecat.entity.IMemberInGroup | angular.IPromise<void>> {
        if (!this.activeGrpMemId) {
            this.c.$q.reject(() => {
                this.logWarn('Not active course selected!', null, false);
                return 'A course must be selected';
            });
        }

        const self = this;
        let grpMem: ecat.entity.IMemberInGroup = null;
        const api = this.studentApiResources;
        const isLoaded = api.getGroupMembers.resource.isLoaded.group;
        
        if (isLoaded[this.activeGrpMemId]) {
            const pred = new breeze.Predicate('id', breeze.FilterQueryOp.Equals, this.activeGrpMemId);

            grpMem = this.queryLocal(api.getGroupMembers.resource.name, null, pred) as ecat.entity.IMemberInGroup;
            this.logSuccess('Course loaded from local cache', grpMem, false);
            return this.c.$q.when(grpMem);
        }

        return this.query.from(api.getGroupMembers.resource.name)
            .using(this.manager)
            .withParameters({ grpMemId: this.activeGrpMemId})
            .execute()
            .then(getGrpMembersResponse)
            .catch(this.queryFailed);

        function getGrpMembersResponse(data: breeze.QueryResult) {

            grpMem = data.results[0] as ecat.entity.IMemberInGroup;

            if (!grpMem) {
                return self.c.$q.reject(() => self.logWarn('Query succeeded, but the group membership did not return a result', data, false)) as any;
            }

            return grpMem;
        }
    }

    getNewSpAssessResponse(assessor: ecat.entity.IMemberInGroup, assessee: ecat.entity.IMemberInGroup, inventory: Ecat.Shared.Model.SpInventory): ecat.entity.ISpAssess {
        const newAssessResponse = {
            assessor: assessor,
            assessee: assessee,
            inventoryItem: inventory
        }

        return this.manager.createEntity(AppVar.EcMapEntityType.spAssessResponse, newAssessResponse) as ecat.entity.ISpAssess;
    }
}