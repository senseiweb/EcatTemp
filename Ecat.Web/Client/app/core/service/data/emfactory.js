System.register(['breeze', "core/common/mapStrings"], function(exports_1) {
    var _mp;
    var EcEmFactory;
    return {
        setters:[
            function (_1) {},
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcEmFactory = (function () {
                function EcEmFactory($injector) {
                    this.$injector = $injector;
                    this.common = this.$injector.get('core.service.common');
                }
                EcEmFactory.prototype.getRepo = function (reporName) {
                    var repo = this.$injector.get("data." + reporName);
                    return repo;
                };
                EcEmFactory.prototype.getNewManager = function (apiResourceName, clientExtensions) {
                    var _this = this;
                    breeze.NamingConvention.camelCase.setAsDefault();
                    new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();
                    var serviceName = this.common.appEndpoint + apiResourceName;
                    var metaDataStore = this.createMetadataStore(clientExtensions);
                    var mgr = new breeze.EntityManager({
                        serviceName: serviceName,
                        metadataStore: metaDataStore
                    });
                    if (apiResourceName !== _mp.EcMapApiResource.user) {
                        return mgr;
                    }
                    mgr.fetchMetadata()
                        .then(function () {
                        _this.common.broadcast(_this.common.coreCfg.coreApp.events.managerLoaded, { loaded: true, mgrName: apiResourceName });
                        _this.common.logger.log(apiResourceName + " Manager created and loaded", mgr, 'EM Factory', false);
                    })
                        .catch(function (error) {
                        _this.common.logger.logError(apiResourceName + "} Manager could not be loaded. This is a critical error.\nPlease attempt reload the application", error, 'EM-Factory', true);
                        _this.common.$state.go(_this.common.stateMgr.core.error.name);
                    });
                    return mgr;
                };
                //#region Internal Api
                EcEmFactory.prototype.createMetadataStore = function (clientExtensions) {
                    var metadataStore = new breeze.MetadataStore();
                    if (clientExtensions && clientExtensions.length > 0) {
                        clientExtensions.forEach(function (ext) {
                            metadataStore.registerEntityTypeCtor(ext.entityName, ext.ctorFunc, ext.initFunc);
                        });
                    }
                    return metadataStore;
                };
                EcEmFactory.prototype.registerResourceTypes = function (metadataStore, resourceToMap) {
                    for (var resourceEntity in resourceToMap) {
                        if (resourceToMap.hasOwnProperty(resourceEntity)) {
                            var selectedResource = resourceToMap[resourceEntity];
                            if (selectedResource.returnedEntityType !== _mp.EcMapEntityType.unk) {
                                metadataStore.setEntityTypeForResourceName(selectedResource.resource, selectedResource.returnedEntityType);
                            }
                        }
                    }
                };
                EcEmFactory.serviceId = 'core.data.emfactory';
                EcEmFactory.$inject = ['$injector'];
                return EcEmFactory;
            })();
            exports_1("default", EcEmFactory);
        }
    }
});
