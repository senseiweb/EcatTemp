import * as _mp from "core/common/mapStrings"
import _core from "core/states/core"

export default class StudentStates {
    private isStudentLoaded = false;
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
                moduleInit: ['$ocLazyLoad', this.loadModule]
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

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isStudentLoaded ? this.isStudentLoaded :
            System.import('app/student/appStudent.js')
                .then((studentModClass: any) => {
                    const studMod = studentModClass.default.load();
                    $ocLl.inject(studMod.moduleId);
                    this.isStudentLoaded = true;
                });
    }
}