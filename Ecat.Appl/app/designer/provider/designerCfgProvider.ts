export default class EcCoreCfgProvider {
    static providerId = 'designerCfg';

    constructor() {
        this.$get = (): ecat.ICoreCfg =>
            (
                {
                    errorPrefix: this.errorPrefix,
                    coreEvents: this.designerEvents
                }
            );
    }

    $get: any;

    errorPrefix: string;
    designerEvents: ecat.ICourseAdminEvents = {};
}