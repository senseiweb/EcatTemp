export default class EcCoreCfgProvider {
    static providerId = 'courseAdminCfg';

    constructor() {
        this.$get = (): ecat.ICoreCfg =>
            (
                {
                    errorPrefix: this.errorPrefix,
                    coreEvents: this.courseAdminEvents
                }
            );
    }

    $get: any;

    errorPrefix: string;
    courseAdminEvents: ecat.ICourseAdminEvents = {};
}