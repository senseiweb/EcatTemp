import CoreStates from "core/config/statesCore"
import AdminStates from "admin/config/statesAdmin"

export default class EcStateProvider {
    static providerId = 'ecStateCfg';

    constructor()
        {
            this.$get = () => (
                {
                    core: this.core,
                    admin: this.admin
                });
        }

    $get: any;
    core: CoreStates;
    admin: AdminStates;

}