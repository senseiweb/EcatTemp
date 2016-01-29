import CoreStates from "core/config/statesCore"
import IEcAdminModule from "admin/admin"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcAdminStates {
    private core: CoreStates;
    private isAdminLoaded = false;

    constructor() {
        this.core = new CoreStates();
    }

    private isAuthorized = (manager: boolean, isLoggedIn: boolean, common:ICommon, dataCtx: IDataCtx, authorizedRoles: Array<string>): angular.IPromise<any> => {
        const deferred = common.$q.defer();

        if (!manager || !isLoggedIn) {
            deferred.reject('missing dependencies');
        }
        if (!dataCtx.user.isAuthorized(authorizedRoles)) {
            deferred.reject('missing dependencies');
        };
        deferred.resolve();
        return deferred.promise;
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {

        return this.isAdminLoaded ? this.isAdminLoaded : System.import('app/admin/admin.js').then((adminModClass: any) => {
            const adminClass = new adminModClass.default();
            $ocLl.load(adminClass.adminModule)
                .then(() => this.isAdminLoaded = true)
                .catch(() => this.isAdminLoaded = false);
        });
    }

    get main(): angular.ui.IState {
        const authorizedRoles = [AppVar.EcMapInstituteRole.hqAdmin];
        return {
            name: `${this.core.main.name}.admin`,
            parent: this.core.main.name,
            url: '/admin',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                isAuthorized: (userRole: string) => authorizedRoles.some(role => userRole === role)
            },
            resolve: {
                authorized: ['manager', 'isLoggedIn', ICommon.serviceId, IDataCtx.serviceId, (manager, isLoggedIn, common, dataCtx) => this.isAuthorized(manager, isLoggedIn, common, dataCtx, authorizedRoles)],
                moduleInit: ['$ocLazyLoad', this.loadModule]
            }
        };
    }

    get academy(): angular.ui.IState {
        return {
            name: `${this.main.name}.academy`,
            parent: this.main.name,
            url: '/academy',
            templateUrl: 'wwwroot/app/admin/academy/academy.html',
            controller: 'app.admin.academy as acad',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        };
    }

}
