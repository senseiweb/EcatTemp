export default class EcCoreCfgProvider {
    static providerId = 'studCfg';

    constructor() {
        this.$get = (): ecat.ICoreCfg =>
            (
                {
                    errorPrefix: this.errorPrefix,
                    coreEvents: this.studEvents
                }
            );
    }

    $get: any;

    errorPrefix: string;
    studEvents: ecat.IStudEvents = {};
}