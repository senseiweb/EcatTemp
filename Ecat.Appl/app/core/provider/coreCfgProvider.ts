
export default class EcCoreCfgProvider {
    static providerId = 'coreModCfg';

    constructor()
        {
            this.$get = (): ecat.ICoreCfg =>
                (
                    {
                        errorPrefix: this.errorPrefix,
                        coreEvents: this.coreEvents
                    }
                );
        }

    $get: any;

    errorPrefix: string;
    coreEvents: ecat.IGlobalEvents = {};
}