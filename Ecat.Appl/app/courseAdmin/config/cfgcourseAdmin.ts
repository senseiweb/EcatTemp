﻿//import IAuthService from "instructor/service/instructorRequestAuth"
import ICoreCfg from "core/provider/coreCfgProvider"

export default class EcCoreConfig {
    static $inject = ['$httpProvider', '$ocLazyLoadProvider', `${ICoreCfg.providerId}Provider`, '$provide'];

    private globalEvents = {
        saveChangesEventId: 'global.data.saveChanges',
        managerCreatedId: 'global.data.mangerCreated',
        managerLoadedId: 'global.data.managerLoaded',
        addManagerId: 'global.data.addManager'
    }

    constructor($httpProvider: angular.IHttpProvider,
        $ocLazyLoadProvider: oc.ILazyLoadProvider,
        coreCfg: ICoreCfg,
        $provide: angular.auto.IProvideService) {

        coreCfg.errorPrefix = '[Core Error]: ';

        $ocLazyLoadProvider.config({
            debug: true
        });

        $provide.decorator('taOptions', [
            '$delegate', '$timeout', (taOptions, $timeout) => {
                taOptions.toolbar = [
                    ['p', 'quote', 'bold', 'italics', 'underline', 'ul', 'ol', 'clear'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent'],
                    ['insertLink', 'charcount']
                ];

                taOptions.setup.textEditorSetup = ($element) => {
                    $timeout($element.trigger('focus'));
                }
                return taOptions;
            }
        ]);

        //$httpProvider.interceptors.push(IAuthService.serviceId);

        coreCfg.coreEvents.saveChangesEvent = this.globalEvents.saveChangesEventId;
        coreCfg.coreEvents.managerCreated = this.globalEvents.managerCreatedId;
        coreCfg.coreEvents.managerLoaded = this.globalEvents.managerLoadedId;
        coreCfg.coreEvents.addManager = this.globalEvents.addManagerId;
    }
}
