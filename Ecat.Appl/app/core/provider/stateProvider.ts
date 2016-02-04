import CoreStates from "core/config/statesCore"
import AdminStates from "admin/config/statesAdmin"
import StudentStates from "student/config/statesStudent"

export default class EcStateProvider {
    static providerId = 'ecStateCfg';

    constructor()
        {
            this.$get = () => (
                {
                    core: this.core,
                    admin: this.admin,
                    student: this.student
                });
        }

    $get: any;
    core: CoreStates;
    admin: AdminStates;
    student: StudentStates;

}