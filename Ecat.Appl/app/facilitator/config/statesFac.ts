import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"

export default class EcFacilitatorStates {
  
    private isFacilitatorLoaded = false;

    main: angular.ui.IState;
    groups: angular.ui.IState;

    constructor(coreMain: angular.ui.IState) {
        this.main = {
            name: `${coreMain.name}.facilitator`,
            parent: coreMain.name,
            url: '/facilitator',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [AppVar.EcMapInstituteRole.facilitator, AppVar.EcMapInstituteRole.external]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule]
            }

        }

        this.groups = {
            name: `${this.main.name}.groups`,
            parent: this.main.name,
            url: '/groups',
            templateUrl: 'wwwroot/app/facilitator/features/groups/groups.html',
            controller: 'app.facilitator.features.groups as groups',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        if ()
        return this.isFacilitatorLoaded ? this.isFacilitatorLoaded :
            System.import('app/facilitator/facilitator.js').then((facClass: any) => {
                const facMod = facClass.default.load();
                $ocLl.inject(facMod.moduleId);
                this.isFacilitatorLoaded = true;
            });
    }
}


   

