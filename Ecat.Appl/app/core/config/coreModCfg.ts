import ICoreModCfgProvider from "core/provider/coreModCfgProvider"


export default class CoreModuleConfig {
    static $inject = [`${ICoreModCfgProvider.providerId}Provider`];
    constructor(coreModCfg: ICoreModCfgProvider) {
        coreModCfg.errorPrefix = 'ERROR [Core]: ';
    }
}

