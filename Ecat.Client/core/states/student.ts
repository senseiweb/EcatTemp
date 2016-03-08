import * as _mp from "core/common/mapStrings"
import IDataCtx from "core/service/data/context"
import _core from "core/states/core"

export default class StudentStates {
    private isStudentAppLoaded = false;
    parentName = 'student';

    main: angular.ui.IState;
    assessment: angular.ui.IState;
    assess: angular.ui.IState;

    constructor() {
        this.main = {
            name: `${_core.mainRefState.name}.student`,
            parent: _core.mainRefState.name,
            url: '/student',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [_mp.EcMapInstituteRole.student]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule],
                tokenValid: ['tokenValid', (tokenValid) => tokenValid],
                dCtxReady: ['moduleInit', 'tokenValid', IDataCtx.serviceId, (m, t, dCtx: IDataCtx) => {
                    console.log(dCtx.student.activeCourseId);
                    return dCtx.student.activate().then(() =>
                        console.log('Student Manager Ready'));
                }]
            }

        }

        this.assessment = {
            name: `${this.main.name}.assessment`,
            parent: this.main.name,
            url: '/assessment',
            templateUrl: '@[appStudent]/feature/assess/main.html',
            controller: 'app.student.assessment as assess',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
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