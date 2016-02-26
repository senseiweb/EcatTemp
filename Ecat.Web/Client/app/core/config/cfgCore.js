System.register(["core/service/authenicator", "core/config/cfgProviders"], function(exports_1) {
    var authenicator_1, cfgProviders_1;
    var EcCoreConfig;
    return {
        setters:[
            function (authenicator_1_1) {
                authenicator_1 = authenicator_1_1;
            },
            function (cfgProviders_1_1) {
                cfgProviders_1 = cfgProviders_1_1;
            }],
        execute: function() {
            EcCoreConfig = (function () {
                function EcCoreConfig($httpProvider, $ocLazyLoadProvider, coreCfg, $provide) {
                    this.globalEvents = {
                        saveChangesEventId: 'global.data.saveChanges',
                        managerCreatedId: 'global.data.mangerCreated',
                        managerLoadedId: 'global.data.managerLoaded',
                        addManagerId: 'global.data.addManager'
                    };
                    var coreAppCfg = {
                        errorPrefix: '[Core Error]: ',
                        name: 'Core',
                        version: 0,
                        events: {
                            saveChangesEvent: this.globalEvents.saveChangesEventId,
                            managerCreated: this.globalEvents.managerCreatedId,
                            managerLoaded: this.globalEvents.managerLoadedId,
                            addManager: this.globalEvents.addManagerId
                        }
                    };
                    coreCfg.coreApp = coreAppCfg;
                    $ocLazyLoadProvider.config({
                        debug: true
                    });
                    $provide.decorator('taOptions', [
                        '$delegate', '$timeout', function (taOptions, $timeout) {
                            taOptions.toolbar = [
                                ['p', 'quote', 'bold', 'italics', 'underline', 'ul', 'ol', 'clear'],
                                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent'],
                                ['insertLink', 'charcount']
                            ];
                            taOptions.setup.textEditorSetup = function ($element) {
                                $timeout($element.trigger('focus'));
                            };
                            return taOptions;
                        }
                    ]);
                    $httpProvider.interceptors.push(authenicator_1.default.serviceId);
                }
                EcCoreConfig.$inject = ['$httpProvider', '$ocLazyLoadProvider', (cfgProviders_1.default.appCfgProvider.id + "Provider"), '$provide'];
                return EcCoreConfig;
            })();
            exports_1("default", EcCoreConfig);
        }
    }
});
