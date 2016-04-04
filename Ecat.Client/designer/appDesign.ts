import angular = require('angular')
import designCtx from "designer/service/designCtx"

export default class EcDesignerModule {
    moduleId = 'app.designer';
    static load = () => new EcDesignerModule();
    constructor() {
        angular.module(this.moduleId, [])
            //.controller(assessList.controllerId, assessList)
            //.controller(assess.controllerId, assess)
            .service(designCtx.serviceId, designCtx);
    }
}