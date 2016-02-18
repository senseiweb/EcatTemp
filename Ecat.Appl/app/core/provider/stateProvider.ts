import CoreStates from "core/config/statesCore"
import AdminStates from "admin/config/statesAdmin"
import StudentStates from "student/config/statesStudent"
import FacilitatorStates from "facilitator/config/statesFac"
import CourseAdminStates from "courseAdmin/config/statesCourseAdmin"
import DesignerStates from "designer/config/statesDesigner"


export default class EcStateProvider {
    static providerId = 'ecStateCfg';

    constructor()
        {
            this.$get = () => (
                {
                    core: this.core,
                    admin: this.admin,
                    student: this.student,
                    fac: this.fac,
                    cAdmin: this.cAdmin,
                    designer: this.designer
                });
        }

    $get: any;
    core: CoreStates;
    admin: AdminStates;
    student: StudentStates;
    fac: FacilitatorStates;
    cAdmin: CourseAdminStates;
    designer: DesignerStates;

}