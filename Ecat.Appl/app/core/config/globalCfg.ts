import ICoreModCfgProvider from "core/provider/coreModCfgProvider"
import IAuthService from "core/service/requestAuthenicator"

export default class EcatGlobalConfig {
    static $inject = ['$httpProvider','$ocLazyLoadProvider', `${ICoreModCfgProvider.providerId}Provider`, '$provide'];
    private globalEvents = {
        saveChangesEventId: 'global.data.saveChanges'
    }

    constructor($httpProvider: angular.IHttpProvider,
        $ocLazyLoadProvider: oc.ILazyLoadProvider,
        coreModCfg: ICoreModCfgProvider,
        $provide: angular.auto.IProvideService    ) {

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
            ]
        );

        $httpProvider.interceptors.push(IAuthService.serviceId);

        coreModCfg.globalEvent.saveChangesEvent = this.globalEvents.saveChangesEventId;
    }
}

