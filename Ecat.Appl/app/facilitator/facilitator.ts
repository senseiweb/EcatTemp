import ng = require('angular')
import 'ngTable'

export default class EcFacilitatorModule {
    static moduleId = 'app.Facilitator';
    facilitatorModule: angular.IModule;
    constructor() {
        this.facilitatorModule = ng.module(EcFacilitatorModule.moduleId, ['ngTable']);
    }
}