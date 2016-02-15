import ng = require('angular')
import 'ngTable'
import designerCfgProvider from 'designer/provider/designerCfgProvider'
import designerConfig from 'designer/config/cfgDesigner'
import instruments from "designer/features/instruments/instruments"


export default class EcDesignerModule {
    static moduleId = 'designer';
    designerModule: angular.IModule;
    constructor() {
        this.designerModule = ng.module(EcDesignerModule.moduleId, ['ngTable'])
            .config(designerConfig)
            .provider(designerCfgProvider.providerId, designerCfgProvider)
            .controller(instruments.controllerId, instruments);
            //.controller(groups.controllerId, groups);
    }
}