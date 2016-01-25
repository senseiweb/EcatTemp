import CoreStates from "core/config/states/core"
import AdminStates from "core/config/states/admin"

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