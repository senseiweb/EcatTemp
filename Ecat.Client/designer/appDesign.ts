import angular = require('angular')
import designCtx from "designer/service/designCtx"
import instrCntrl from "designer/features/instrument/instr"
import inventCntrl from "designer/features/instrument/inventory"
import modelCntrl from "designer/features/model/wgModel"

export default class EcDesignerModule {
    moduleId = 'app.designer';
    static load = () => new EcDesignerModule();
    constructor() {
        angular.module(this.moduleId, [])
            .controller(instrCntrl.controllerId, instrCntrl)
            .controller(inventCntrl.controllerId, inventCntrl)
            .controller(modelCntrl.controllerId, modelCntrl)
            .service(designCtx.serviceId, designCtx);
    }
}