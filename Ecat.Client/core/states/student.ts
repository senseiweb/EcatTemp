import * as _mp from "core/common/mapStrings"
import IDataCtx from "core/service/data/context"
import _core from "core/states/core"

export default class StudentStates {
    private isStudentAppLoaded = false;
    parentName = 'student';

    main: angular.ui.IState;
    assessment: angular.ui.IState;
    assess: angular.ui.IState;
    result: angular.ui.IState;
    constructor() {
        this.main = {
            name: `${_core.mainRefState.name}.student`,
            parent: _core.mainRefState.name,
            url: '/student',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [_mp.MpInstituteRole.student]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule],
                tokenValid: ['tokenValid', (tokenValid) => tokenValid],
                dCtxReady: ['moduleInit', 'tokenValid', IDataCtx.serviceId, (m, t, dCtx: IDataCtx) => {
                    return dCtx.student.activate().then(() =>
                        console.log('Student Manager Ready'));
                }]
            }

        }

        this.assessment = {
            name: `${this.main.name}.assessment`,
            parent: this.main.name,
            url: '/assessment',
            templateUrl: '@[appStudent]/feature/assess/assess.html',
            controller: 'app.student.assessment as assess',
            resolve: {
                moduleLoad: ['dCtxReady', (dCtxReady) => dCtxReady],
                courseInit: ['moduleLoad',IDataCtx.serviceId,(module,dCtx: IDataCtx) => {dCtx.student.initCrseStudGroup(false)}]
            }
        }

        this.assess = {
            name: `${this.main.name}.list`,
            parent: this.assessment.name,
            url: '/list/{crseId:int}/{wgId:int}',
            templateUrl: '@[appStudent]/feature/assess/list.html',
            controller: 'app.student.assessment.list as al',
            resolve: {
                courseInit: ['courseInit',(courseInit)=>courseInit]
            }
        }

        this.result = {
            name: `${this.main.name}.result`,
            url:'/results/{crseId:int}/{wgId:int}',
            parent: this.assessment.name,
            templateUrl: '@[appStudent]/feature/assess/result.html',
            controller: 'app.student.assessment.result as ar'
        }
        
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => System.import('app/student/appStudent.js')
        .then((studClass: any) => {
            if (!this.isStudentAppLoaded) {
                const studMod = studClass.default.load();
                $ocLl.inject(studMod.moduleId);
                this.isStudentAppLoaded = true;
            } else {
                return true;
            }
        });
}