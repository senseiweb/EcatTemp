import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcAdminStates {
    private isAdminLoaded = false;

    main: angular.ui.IState;
    assess: angular.ui.IState;
    myGroups: angular.ui.IState;
    groups: angular.ui.IState;



    constructor(coreMain: angular.ui.IState) {

        this.main = {
            name: `${coreMain.name}.facilitator`,
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

        this.assess = {
            name: `${this.main.name}.academy`,
            parent: this.main.name,
            abstract: true,
            url: '/academy',
            templateUrl: 'wwwroot/app/admin/academy/academy.html',
            controller: 'app.admin.academy as acad',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }

        this.myGroups = {
            name: `${this.main.name}.academy`,
            parent: this.main.name,
            abstract: true,
            url: '/academy',
            templateUrl: 'wwwroot/app/admin/academy/academy.html',
            controller: 'app.admin.academy as acad',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }

        this.groups = {
            name: `${this.main.name}.academy`,
            parent: this.main.name,
            abstract: true,
            url: '/academy',
            templateUrl: 'wwwroot/app/admin/academy/academy.html',
            controller: 'app.admin.academy as acad',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isAdminLoaded ? this.isAdminLoaded : System.import('app/facilitator/admin.js').then((adminModClass: any) => {
            const adminClass = new adminModClass.default();
            $ocLl.load(adminClass.adminModule)
                .then(() => this.isAdminLoaded = true)
                .catch(() => this.isAdminLoaded = false);
        });
    }
}
