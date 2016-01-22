export default class EcCoreModeCfgProvider {
    static providerId = 'coreModCfg';

    constructor()
        {
            this.$get = (): ecat.ICoreModCfg =>
                (
                    {
                        errorPrefix: this.errorPrefix,
                        globalEvent: this.globalEvent
                    }
                );
        }

    $get: any;

    errorPrefix: string;
    globalEvent: ecat.IGlobalEvents = {};
}