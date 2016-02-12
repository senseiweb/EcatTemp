import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcDesignerStates {

    private isDesignerLoaded = false;

    main: angular.ui.IState;
    instruments: angular.ui.IState;
    //inventories: angular.ui.IState;

    constructor(coreMain: angular.ui.IState, coreDash: angular.ui.IState) {
        this.main = {
            name: `${coreMain.name}.designer`,
            parent: coreMain.name,
            url: '/designer',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [AppVar.EcMapInstituteRole.designer, AppVar.EcMapInstituteRole.external]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule],
            }

        }

        this.instruments = {
            name: `${this.main.name}.instruments`,
            parent: this.main.name,
            url: '/instruments',
            templateUrl: 'wwwroot/app/designer/features/instruments/instruments.html',
            controller: 'app.designer.features.instruments as instruments',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }

        //this.inventories = {
        //    name: `${this.main.name}.inventories`,
        //    parent: this.main.name,
        //    url: '/inventories',
        //    templateUrl: 'wwwroot/app/designer/features/inventories/inventories.html',
        //    controller: 'app.designer.features.inventories as inventories',
        //    resolve: {
        //        moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
        //    }
        //}
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isDesignerLoaded ? this.isDesignerLoaded : System.import('app/designer/designer.js').then((designerModClass: any) => {
            const designerClass = new designerModClass.default();
            $ocLl.load(designerClass.designerModule)
                .then(() => this.isDesignerLoaded = true)
                .catch(() => this.isDesignerLoaded = false);
        });
    }
}

