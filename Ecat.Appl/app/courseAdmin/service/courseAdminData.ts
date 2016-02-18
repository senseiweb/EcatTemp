import IUtilityRepo from 'core/service/data/utility'
import IMockRepo from "core/service/data/mock"
import * as AppVar from 'appVars'

interface ICourseAdminApiResources extends ecat.IApiResources {
    getCourses: ecat.IApiResource,
    getGroups: ecat.IApiResource;
}

export default class EcCourseAdminRepo extends IUtilityRepo {
    static serviceId = 'data.courseAdmin';
    static $inject = ['$injector'];

    activated = false;
    academy: ecat.entity.IAcademy;
    selectedCourse: ecat.entity.ICourse;
    courses: ecat.entity.ICourse[] = [];

    private crseAdminApiResources: ICourseAdminApiResources = {
        getCourses: {
            returnedEntityType: this.c.appVar.EcMapEntityType.course,
            resource: {
                name: 'GetCourses',
                isLoaded: false
            }
        },
        getGroups: {
            returnedEntityType: this.c.appVar.EcMapEntityType.group,
            resource: {
                name: 'GetGroups',
                isLoaded: false
            }
        }
    };

    constructor(inj) {
        super(inj, 'Course Admin Data Service', AppVar.EcMapApiResource.courseAdmin, []);
        this.loadManager(this.crseAdminApiResources);
    }
}