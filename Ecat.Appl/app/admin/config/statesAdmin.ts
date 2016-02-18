import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"

export default class EcAdminStates {
    private isAdminLoaded = false;

    main: angular.ui.IState;
    academy: angular.ui.IState;
    
    constructor(coreMain: angular.ui.IState) {

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
                moduleInit: ['$ocLazyLoad', this.loadModule]
            }
        }

        this.academy = {
            name: `${this.main.name}.academy`,
            parent: this.main.name,
            url: '/academy',
            templateUrl: 'wwwroot/app/admin/academy/academy.html',
            controller: 'app.admin.academy as acad',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isAdminLoaded ? this.isAdminLoaded :
            System.import('app/admin/admin.js')
            .then((adminModClass: any) => {
                const adminMod = adminModClass.default.load();
                $ocLl.inject(adminMod.moduleId);
                this.isAdminLoaded = true;
            });
    }
}
