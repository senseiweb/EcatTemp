import CoreStates from "core/config/statesCore"
import IEcStudentModule from "student/student"
import * as AppVar from "appVars"
import IDataCtx from 'core/service/data/context'
import ICommon from "core/service/common"

export default class EcStudentStates {
    private core: CoreStates;
    private isStudentLoaded = false;

    constructor() {
        this.core = new CoreStates();
    }

    private isAuthorized = (manager: boolean, isLoggedIn: boolean, common:ICommon, dataCtx: IDataCtx, authorizedRoles: Array<string>): angular.IPromise<any> => {
        const deferred = common.$q.defer();

        if (!manager || !isLoggedIn) {
            deferred.reject('missing dependencies');
        }
        if (!dataCtx.user.isAuthorized(authorizedRoles)) {
            deferred.reject('missing dependencies');
        };
        deferred.resolve();
        return deferred.promise;
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => {

        return this.isStudentLoaded ? this.isStudentLoaded : System.import('app/student/student.js').then((studentModClass: any) => {
            const studentClass = new studentModClass.default();
            $ocLl.load(studentClass.studentModule)
                .then(() => this.isStudentLoaded = true)
                .catch(() => this.isStudentLoaded = false);
        });
    }

    get main(): angular.ui.IState {
        const authorizedRoles = [AppVar.EcMapInstituteRole.external, AppVar.EcMapInstituteRole.student];
        return {
            name: `${this.core.main.name}.student`,
            parent: this.core.main.name,
            url: '/student',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                isAuthorized: (userRole: string) => authorizedRoles.some(role => userRole === role)
            },
            resolve: {
                authorized: ['manager', 'isLoggedIn', ICommon.serviceId, IDataCtx.serviceId, (manager, isLoggedIn, common, dataCtx) => this.isAuthorized(manager, isLoggedIn, common, dataCtx, authorizedRoles)],
                moduleInit: ['$ocLazyLoad', this.loadModule]
            }
        };
    }

    get assessments(): angular.ui.IState {
        return {
            name: `${this.main.name}.assessments`,
            parent: this.main.name,
            url: '/student',
            templateUrl: 'wwwroot/app/student/assessments/assessments.html',
            controller: 'app.student.assessments as stu',
            resolve: {
                moduleLoad: ['moduleInit', (moduleInit) => moduleInit]
            }
        };
    }

}
