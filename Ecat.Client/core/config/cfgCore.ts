import IAuthService from "core/service/authenicator"
import _cfgProvider from "core/config/cfgProviders"

export default class EcCoreConfig {

    private globalEvents = {
        saveChangesEventId: 'global.data.saveChanges',
        managerCreatedId: 'global.data.mangerCreated',
        managerLoadedId: 'global.data.managerLoaded',
        addManagerId: 'global.data.addManager'
    }

    constructor($httpProvider: angular.IHttpProvider,
        $ocLazyLoadProvider: oc.ILazyLoadProvider,
        coreCfg: ecat.IModuleAppCfg,
        $provide: angular.auto.IProvideService) {

        const coreAppCfg: ecat.ICoreAppConfig =
        {
                errorPrefix: '[Core Error]: ',
                name: 'Core',
                version: 0,
                events: {
                    saveChangesEvent: this.globalEvents.saveChangesEventId,
                    managerCreated: this.globalEvents.managerCreatedId,
                    managerLoaded:  this.globalEvents.managerLoadedId,
                    addManager: this.globalEvents.addManagerId
                }
        }

        coreCfg.coreApp = coreAppCfg;

        $ocLazyLoadProvider.config({
            debug: false
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

        $httpProvider.interceptors.push(IAuthService.serviceId);
   }
}

