import ng = require('angular')
import 'ngTable'
import academy from "admin/academy/academy"

export default class EcAdminModule {
    static moduleId = 'sysAmdin';
    adminModule: angular.IModule;
    constructor() {
       this.adminModule = ng.module(EcAdminModule.moduleId, ['ngTable'])
            .controller(academy.controllerId, academy);
    }
}