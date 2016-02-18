import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"

export default class EcStudentStates {
  
    private isStudentLoaded = false;

    main: angular.ui.IState;
    assessment: angular.ui.IState;
    assess: angular.ui.IState;

    constructor(coreMain: angular.ui.IState) {
        this.main = {
            name: `${coreMain.name}.student`,
            parent: coreMain.name,
            url: '/student',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                authorized: [AppVar.EcMapInstituteRole.student, AppVar.EcMapInstituteRole.external]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule]
            }

        }

        this.assessment = {
            name: `${this.main.name}.assessment`,
            parent: this.main.name,
            url: '/assessment',
            templateUrl: 'wwwroot/app/student/features/assessments/assessments.html',
            controller: 'app.student.assessment as assess',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isStudentLoaded ? this.isStudentLoaded :
            System.import('app/student/student.js')
            .then((studentModClass: any) => {
                const studMod = studentModClass.default.load();
                $ocLl.inject(studMod.moduleId);
                this.isStudentLoaded = true;
            });
    }
}


   

