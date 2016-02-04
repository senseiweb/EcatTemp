import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcStudentStates {
  
    private isStudentLoaded = false;

    main: angular.ui.IState;
    assessment: angular.ui.IState;

    constructor(coreMain: angular.ui.IState, coreDash: angular.ui.IState) {
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
                moduleInit: ['$ocLazyLoad', this.loadModule],
            }

        }

        this.assessment = {
            name: `${this.main.name}.assessment`,
            parent: this.main.name,
            url: '/assessment',
            templateUrl: 'wwwroot/app/student/assessments/assessments.html',
            controller: 'app.student.assessment as assess',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {
        return this.isStudentLoaded ? this.isStudentLoaded : System.import('app/student/student.js').then((studentModClass: any) => {
            const studentClass = new studentModClass.default();
            $ocLl.load(studentClass.studentModule)
                .then(() => this.isStudentLoaded = true)
                .catch(() => this.isStudentLoaded = false);
        });
    }
}


   

