import _core from 'core/states/core'
import * as _mp from 'ore/common/mapStrings'

export default class EcFacultyStates {

    private isFacilitatorLoaded = false;
    parentName = 'faculty';

    main: angular.ui.IState;
    workGroup: angular.ui.IState;
    wgList: angular.ui.IState;
    wgAssess: angular.ui.IState;
    wgPublish: angular.ui.IState;
    wgCaps: angular.ui.IState;
    wgResult: angular.ui.IState;

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

        this.workGroup = {
            name: `${this.main.name}.workgroup`,
            abstract: true,
            parent: this.main.name,
            url: '/workGroup',
            templateUrl: '@[appFaculty]/feature/workgroups/workgroup.html',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }

        this.wgList = {
            name: `${this.workGroup.name}.list`,
            parent: this.workGroup.name,
            url: '',
            templateUrl: '@[appFaculty]/feature/workgroups/list.html',
            controller: 'app.faculty.wkgrp.list as wkl'
        }

        this.wgAssess = {
            name: `${this.workGroup.name}.assess`,
            parent: this.workGroup.name,
            url: '/assess',
            templateUrl: '@[appFaculty]/feature/workgroups/assess.html',
            controller: 'app.faculty.wkgrp.assess as wka'
        }

        this.wgPublish = {
            name: `${this.workGroup.name}.publish`,
            parent: this.workGroup.name,
            url: '/publish',
            templateUrl: '@[appFaculty]/feature/workgroups/publish.html',
            controller: 'app.faculty.wkgrp.publish as wkp'
        }

        this.wgCaps = {
            name: `${this.workGroup.name}.capstone`,
            parent: this.workGroup.name,
            url: '/capstone',
            templateUrl: '@[appFaculty]/feature/workgroups/capstone.html',
            controller: 'app.faculty.wkgrp.capstone as wkc'
        }

        this.wgResult = {
            name: `${this.workGroup.name}.result`,
            parent: this.workGroup.name,
            url: '/results',
            templateUrl: '@[appFaculty]/feature/workgroups/result.html',
            controller: 'app.faculty.wkgrp.result as wkr'
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


   

