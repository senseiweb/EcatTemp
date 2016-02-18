import angular = require('angular')
import 'ngTable'
import academy from "admin/features/academy/academy"
import acadFormAdd from "admin/features/academy/addEdit"

export default class EcAdminModule {
    moduleId = 'sysAmdin';
    static load = () => new EcAdminModule();

    constructor() {
       angular.module(this.moduleId, [])
           .controller(academy.controllerId, academy)
           .controller(acadFormAdd.controllerId, acadFormAdd);
    }
}