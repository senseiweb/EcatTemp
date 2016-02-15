import angular = require('angular')
import 'ngTable'
import academy from "admin/features/academy/academy"
import acadFormAdd from "admin/features/academy/addEdit"

export default class EcAdminModule {
    static moduleId = 'sysAmdin';
    static load = () => new EcAdminModule();

    constructor() {
       angular.module(EcAdminModule.moduleId, ['ngTable'])
           .controller(academy.controllerId, academy)
           .controller(acadFormAdd.controllerId, acadFormAdd);
    }
}