import 'breeze'
import * as _mp from "core/common/mapStrings"
import ICommon from "core/common/commonService";

export default class EcEmFactory {
    static serviceId = 'core.data.emfactory';
    static $inject = ['$injector'];
    private common = this.$injector.get('core.service.common') as ICommon;


    constructor(private $injector: angular.auto.IInjectorService) {
    }

    getRepo(reporName: string): any {
        const repo = this.$injector.get(`data.${reporName}`);
        return repo;
    }

    getNewManager(apiResourceName: _mp.EcMapApiResource, clientExtensions?: Array<ecat.entity.IEntityExtension>): breeze.EntityManager {

        breeze.NamingConvention.camelCase.setAsDefault();
        new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();
        const serviceName = this.common.appEndpoint + apiResourceName;
        const metaDataStore = this.createMetadataStore(clientExtensions);
        const mgr = new breeze.EntityManager({
            serviceName: serviceName,
            metadataStore: metaDataStore
        });

        if (apiResourceName !== _mp.EcMapApiResource.user) {
            return mgr;
        }

        mgr.fetchMetadata()
            .then(() => {
                this.common.broadcast(this.common.coreCfg.coreApp.events.managerLoaded,
                    { loaded: true, mgrName: apiResourceName });
                this.common.logger.log(`${apiResourceName} Manager created and loaded`, mgr, 'EM Factory', false);
            })
            .catch((error) => {
                this.common.logger.logError(`${apiResourceName}} Manager could not be loaded. This is a critical error.\nPlease attempt reload the application`, error, 'EM-Factory', true);
                this.common.$state.go(this.common.stateMgr.core.error.name);
            });
        return mgr;
    }

    //#region Internal Api
    private createMetadataStore(clientExtensions: Array<ecat.entity.IEntityExtension>): breeze.MetadataStore {
        const metadataStore = new breeze.MetadataStore();
        if (clientExtensions && clientExtensions.length > 0) {
            clientExtensions.forEach((ext) => {
                metadataStore.registerEntityTypeCtor(ext.entityName, ext.ctorFunc, ext.initFunc);
            });
        }
        return metadataStore;
    }

    registerResourceTypes(metadataStore: breeze.MetadataStore, resourceToMap: ecat.IApiResources) {

        for (let resourceEntity in resourceToMap) {

            if (resourceToMap.hasOwnProperty(resourceEntity)) {

                const selectedResource = resourceToMap[resourceEntity];

                if (selectedResource.returnedEntityType !== _mp.EcMapEntityType.unk) {
                    metadataStore.setEntityTypeForResourceName(selectedResource.resource, selectedResource.returnedEntityType);
                }
            }
        }
    }

    //#endregion
}

