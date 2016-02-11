﻿import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcCourseAdminStates {

    private isCourseAdminLoaded = false;

    main: angular.ui.IState;
    groups: angular.ui.IState;
    courses: angular.ui.IState;

    constructor(coreMain: angular.ui.IState, coreDash: angular.ui.IState) {
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
            url: '/courseAdmin/courses',
            templateUrl: 'wwwroot/app/courseAdmin/features/courses/courses.html',
            controller: 'app.courseAdmin.features.courses as courses',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }

        this.groups = {
            name: `${this.main.name}.groups`,
            parent: this.main.name,
            url: '/courseAdmin/groups',
            templateUrl: 'wwwroot/app/courseAdmin/features/groups/groups.html',
            controller: 'app.courseAdmin.features.groups as groups',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isCourseAdminLoaded ? this.isCourseAdminLoaded : System.import('app/courseAdmin/courseAdmin.js').then((courseAdminModClass: any) => {
            const courseAdminClass = new courseAdminModClass.default();
            $ocLl.load(courseAdminClass.courseAdminModule)
                .then(() => this.isCourseAdminLoaded = true)
                .catch(() => this.isCourseAdminLoaded = false);
        });
    }
}

