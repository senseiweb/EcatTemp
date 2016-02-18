import ICoreCfg from "core/provider/coreCfgProvider"

export default class EcCoreConfig {
    static $inject = [`${ICoreCfg.providerId}Provider`];

    private studentEvents = {
        saveChangesEventId: 'global.data.saveChanges',
        managerCreatedId: 'global.data.mangerCreated',
        managerLoadedId: 'global.data.managerLoaded',
        addManagerId: 'global.data.addManager'
    }

    constructor(coreCfg: ICoreCfg) {
        coreCfg.errorPrefix = '[Student Module Error]: ';
    }
}

