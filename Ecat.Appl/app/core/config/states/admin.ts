import CoreStates from "core/config/states/core"
import IEcAdminModule from "admin/admin"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcAdminStates {
    private core: CoreStates;

    constructor() {
        this.core = new CoreStates();
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return System.import('app/admin/admin.js').then((adminModClass: any) => {
            const adminClass = new adminModClass.default();
            $ocLl.load(adminClass.adminModule);
        });
    }

    get admin(): angular.ui.IState {
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
                authorized: [IDataCtx.serivceId, (dataCtx: IDataCtx) => dataCtx.user.isAuthorized(authorizedRoles)],
                moduleInit: ['$ocLazyLoad', this.loadModule]
            }
        };
    }

    get academy(): angular.ui.IState {
        return {
            name: `${this.admin.name}.academy`,
            parent: this.admin.name,
            url: '/academy',
            templateUrl: 'wwwroot/app/admin/academy/academy.html',
            controller: 'app.admin.academy as admin_acad',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        };
    }

}
