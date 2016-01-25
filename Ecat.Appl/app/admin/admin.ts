import ng = require('angular')
import academy from "admin/academy/academy"

export default class EcAdminModule {
    static moduleId = 'sysAmdin';
    adminModule: angular.IModule;
    constructor() {
       this.adminModule = ng.module(EcAdminModule.moduleId, [])
            .controller(academy.controllerId, academy);
    }
}