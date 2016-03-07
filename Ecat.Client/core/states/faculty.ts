import _core from 'core/states/core'
import IDataCtx from "core/service/data/context"
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyStates {

    private isFacultyAppLoaded = false;
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
                validateToken: true,
                authorized: [_mp.EcMapInstituteRole.faculty]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule],
                tokenValid: ['tokenValid', (tokenValid) => tokenValid],
                dCtxReady: ['moduleInit', 'tokenValid', IDataCtx.serviceId, (m, t, dCtx: IDataCtx) => {
                    console.log(dCtx.faculty.activeCourseId);
                    return dCtx.faculty.activate().then(() =>
                        console.log('Faculty Manager Ready'));
                }]
            }
        }

        this.workGroup = {
            name: `${this.main.name}.workgroup`,
            abstract: true,
            parent: this.main.name,
            url: '/workGroup',
            templateUrl: '@[appFaculty]/feature/workgroups/workgroup.html',
            resolve: {
                facAppReady: ['dCtxReady', (dc) => dc]
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
            url: '/assess/{crseId:int}/{wgId:int}',
            templateUrl: '@[appFaculty]/feature/workgroups/assess.html',
            controller: 'app.faculty.wkgrp.assess as wka'
        }

        this.wgPublish = {
            name: `${this.workGroup.name}.publish`,
            parent: this.workGroup.name,
            url: '/publish/{crseId:int}/{wgId:int}',
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

    private loadModule = ($ocLl: oc.ILazyLoad): void => System.import('app/faculty/appFac.js')
        .then((facClass: any) => {
            if (!this.isFacultyAppLoaded) {
                const facMod = facClass.default.load();
                $ocLl.inject(facMod.moduleId);
                this.isFacultyAppLoaded = true;
            } else {
                return true;
            }
        });

}


   

