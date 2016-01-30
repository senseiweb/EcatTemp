import 'breeze'
import * as appVar from 'appVars'
import ICommon from "core/service/common";

export default class EcEmFactory {
    static serviceId = 'data.emfactory';
    static $inject = ['$injector'];
    private common = this.$injector.get('core.common') as ICommon;

    constructor(private $injector: angular.auto.IInjectorService) {
    }

    getRepo(reporName: string): any {
        const repo = this.$injector.get(`data.${reporName}`);
        return repo;
    }

    getNewManager(apiResourceName: appVar.EcMapApiResource, clientExtensions?: Array<ecat.entity.IEntityExtension>): breeze.EntityManager {
        breeze.NamingConvention.camelCase.setAsDefault();
        new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();
        const serviceName = this.common.appEndpoint + apiResourceName;
        const metaDataStore = this.createMetadataStore(clientExtensions);
        return new breeze.EntityManager({
            serviceName: serviceName,
            metadataStore: metaDataStore
        });
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

                if (selectedResource.returnedEntityType !== this.common.appVar.EcMapEntityType.unk) {
                    metadataStore.setEntityTypeForResourceName(selectedResource.resourceName, selectedResource.returnedEntityType);
                }
            }
        }
    }

//#endregion
}

