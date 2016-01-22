import IUserRepo from 'core/service/data/user'
import IUtilityRepo from 'core/service/data/utility'
import IEntityFactory from 'core/service/data/emFactory'
import * as EntityCfg from 'core/config/entityCfg'
import * as appVars from 'appVars'

export default class EcDataContext {
    static serivceId = 'data.context';
    static $inject = [IUtilityRepo.serviceId, IEntityFactory.serviceId];
    private corePersonConfig: ecat.entity.IEntityExtension = {
        entityName: appVars.EcMapEntityType.person,
        ctorFunc: EntityCfg.PersonClientExtended,
        initFunc: (personEntity: ecat.entity.IPerson) => new EntityCfg.PersonInitializer(personEntity)
    }

    private coreEntityCfgs: Array<ecat.entity.IEntityExtension> = [this.corePersonConfig];

    constructor(private utilityRepo: IUtilityRepo, emFactory: IEntityFactory) {

        this.repoNames.forEach((name: string) => {
            Object.defineProperty(this, name, {
                configurable: true,
                get() {
                    const repo = emFactory.getRepo(name);
                    Object.defineProperty(this, name, {
                        value: repo,
                        configurable: false,
                        enumerable: true
                    });
                    return repo;
                }
            });
        });

        utilityRepo.userManager = emFactory.getNewManager(appVars.EcMapApiResource.user, this.coreEntityCfgs);
    }
    repoNames = [appVars.EcMapApiResource.user];
    user: IUserRepo;


}


