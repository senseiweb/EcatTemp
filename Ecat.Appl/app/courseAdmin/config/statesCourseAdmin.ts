import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"

export default class EcCourseAdminStates {

    private isCourseAdminLoaded = false;

    main: angular.ui.IState;
    groups: angular.ui.IState;
    courses: angular.ui.IState;

    constructor(coreMain: angular.ui.IState) {
        this.main = {
            name: `${coreMain.name}.courseAdmin`,
            parent: coreMain.name,
            url: '/courseAdmin',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [AppVar.EcMapInstituteRole.courseAdmin, AppVar.EcMapInstituteRole.external]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule],
            }

        }

        this.courses = {
            name: `${this.main.name}.courses`,
            parent: this.main.name,
            url: '/courses',
            templateUrl: 'wwwroot/app/courseAdmin/features/courses/courses.html',
            controller: 'app.courseAdmin.features.courses as courses',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }

        this.groups = {
            name: `${this.main.name}.groups`,
            parent: this.main.name,
            url: '/groups',
            templateUrl: 'wwwroot/app/courseAdmin/features/groups/groups.html',
            controller: 'app.courseAdmin.features.groups as groups',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isCourseAdminLoaded ? this.isCourseAdminLoaded :
            System.import('app/courseAdmin/courseAdmin.js').then((courseAdminModClass: any) => {
                const crseAdminMod = courseAdminModClass.default().load();
                $ocLl.inject(crseAdminMod.moduleId);
                this.isCourseAdminLoaded = true;
            });
    }
}

