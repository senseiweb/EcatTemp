import IEntityFactory from 'core/service/data/emFactory'
import IUserData from 'core/service/data/user'
import ILocal from 'core/service/data/local'
import ISysAdminData from "admin/service/adminData"
import * as AppVars from "appVars"

export default class EcDataContext {
    static serviceId = 'data.context';
    static $inject = [IEntityFactory.serviceId];

    areItemsLoaded = {
        userToken: false,
        userProfile: false,
        user: false,
    }

    loadedManagers: Array<{module: string, mgr: breeze.EntityManager}> = [];
    local: ILocal;
    repoNames = [AppVars.EcMapApiResource.user.toLowerCase(), 'local', AppVars.EcMapApiResource.sa.toLowerCase()];
    queryer: breeze.EntityQuery;
    sa: ISysAdminData;
    user: IUserData;

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

        this.queryer = new breeze.EntityQuery();
    }

    private clearManagers(): void {
        this.loadedManagers.forEach((holder) => {
            holder.mgr.clear();
        });
    }
    
    unsavedChanges(): Array<{ name: string, hasChanges: boolean }> {
        const changesStatus: Array<{ name: string, hasChanges: boolean }> = [];
        this.loadedManagers.forEach((holder) => {
            changesStatus.push({ name: holder.module, hasChanges: holder.mgr.hasChanges() });
            }
        );
        return changesStatus.filter(status => status.hasChanges);
    }

    logoutUser(): void {
        this.clearManagers();
        this.user.persona = null;
        this.user.token.auth = null;
        this.user.token.warning = null;
        this.user.token.expire = null;
        this.user.token.userEmail = null;
        this.user.token.password = null;
        this.user.userStatic = null;
        localStorage.removeItem('ECAT:TOKEN');
        sessionStorage.removeItem('ECAT:TOKEN');
        this.user.isLoaded.userToken = false;
    }

}


