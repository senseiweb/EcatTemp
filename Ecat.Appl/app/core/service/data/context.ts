import IEntityFactory from 'core/service/data/emFactory'
import IUserRepo from 'core/service/data/user'
import ILocal from 'core/service/data/local'
import * as AppVars from "appVars"

export default class EcDataContext {
    static serviceId = 'data.context';
    static $inject = [IEntityFactory.serviceId];

    constructor(emFactory: IEntityFactory) {
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

    }
    repoNames = [AppVars.EcMapApiResource.user, 'local'];
    user: IUserRepo;
    local: ILocal;
}


