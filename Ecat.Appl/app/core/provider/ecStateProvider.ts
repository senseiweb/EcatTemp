import IEcGlobal from 'core/config/coreStateConfig'

export default class EcStateProvider {
    static providerId = 'ecStateCfg';

    constructor()
        {
            this.$get = () => (
                {
                    global: this.global
                });
        }

    $get: any;
    global: IEcGlobal;

}