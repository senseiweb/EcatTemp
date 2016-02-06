export default class EcCoreCfgProvider {
    static providerId = 'facilitatorCfg';

    constructor() {
        this.$get = (): ecat.ICoreCfg =>
            (
                {
                    errorPrefix: this.errorPrefix,
                    coreEvents: this.facilitatorEvents
                }
            );
    }

    $get: any;

    errorPrefix: string;
    facilitatorEvents: ecat.IFacilitatorEvents = {};
}