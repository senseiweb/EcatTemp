import CoreStates from "core/config/statesCore"
import AdminStates from "admin/config/statesAdmin"
import StudentStates from "student/config/statesStudent"
import FacilitatorStates from "facilitator/config/statesFac"
import CourseAdminStates from "courseAdmin/config/statesCourseAdmin"

export default class EcStateProvider {
    static providerId = 'ecStateCfg';

    constructor()
        {
            this.$get = () => (
                {
                    core: this.core,
                    admin: this.admin,
                    student: this.student,
                    facilitator: this.facilitator,
                    courseAdmin: this.courseAdmin
                });
        }

    $get: any;
    core: CoreStates;
    admin: AdminStates;
    student: StudentStates;
    facilitator: FacilitatorStates;
    courseAdmin: CourseAdminStates;
}