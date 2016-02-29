import _core from "core/states/core"
import * as _mp from "core/common/mapStrings"

export default class EcFacultyStates {

    private isFacilitatorLoaded = false;
    parentName = 'faculty';

    main: angular.ui.IState;
    groups: angular.ui.IState;

    constructor() {
        this.main = {
            name: `${_core.mainRefState.name}.faculty`,
            parent: _core.mainRefState.name,
            url: '/faculty',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [_mp.EcMapInstituteRole.faculty]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule]
            }
        }

        this.groups = {
            name: `${this.main.name}.groups`,
            parent: this.main.name,
            url: '/groups',
            templateUrl: '@[appFaculty]/feature/workgroups/groups.html',
            controller: 'app.faculty.features.groups as groups',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isFacilitatorLoaded ? this.isFacilitatorLoaded :
            System.import('app/faculty/appFac.js').then((facClass: any) => {
                const facMod = facClass.default.load();
                $ocLl.inject(facMod.moduleId);
                this.isFacilitatorLoaded = true;
            });
    }
}


   

