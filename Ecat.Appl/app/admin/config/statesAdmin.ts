import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcAdminStates {
    private isAdminLoaded = false;

    main: angular.ui.IState;
    academy: angular.ui.IState;
    
    constructor(coreMain: angular.ui.IState, coreDash: angular.ui.IState) {

        this.main = {
            name: `${coreMain.name}.admin`,
            parent: coreMain.name,
            url: '/admin',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [AppVar.EcMapInstituteRole.hqAdmin]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule],
                adminManager: ['userManager', IDataCtx.serviceId, ICommon.serviceId, (um, d, c) => this.loadAdminManager(um, d, c, coreDash)]
            }
        }

        this.academy = {
            name: `${this.main.name}.academy`,
            parent: this.main.name,
            url: '/academy',
            templateUrl: 'wwwroot/app/admin/academy/academy.html',
            controller: 'app.admin.academy as acad',
            resolve: {
                moduleLoad: ['moduleInit', 'adminManager', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isAdminLoaded ? this.isAdminLoaded : System.import('app/admin/admin.js').then((adminModClass: any) => {
            const adminClass = new adminModClass.default();
            $ocLl.load(adminClass.adminModule)
                .then(() => this.isAdminLoaded = true)
                .catch(() => this.isAdminLoaded = false);
        });
    }

    private loadAdminManager = (hasUserManager, dataCtx: IDataCtx, common: ICommon, coreDash): angular.IPromise<any> => {

        if (!hasUserManager) {
            const userMagrError: ecat.IRoutingError = {
                errorCode: AppVar.SysErrorType.MetadataFailure,
                message: 'Cannot load the user metadata!',
                redirectTo: coreDash.name
            }
            return common.$q.all([dataCtx.user.loadUserManager(), dataCtx.sysAdmin.loadAdminManager()])
                .then(() => true)
                .catch(() => userMagrError);
        }

        const error: ecat.IRoutingError = {
            errorCode: AppVar.SysErrorType.MetadataFailure,
            message: 'Cannot load the admin metadata!',
            redirectTo: coreDash.name
        }

        return dataCtx.sysAdmin
            .loadAdminManager()
            .then(() => true)
            .catch(() => error);

    }

}
