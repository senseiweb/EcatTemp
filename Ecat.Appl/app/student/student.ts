import ng = require('angular')
import 'ngTable'
import assessments from 'student/assessments/assessments'

export default class EcStudentModule {
    static moduleId = 'student';
    studentModule: angular.IModule;
    constructor() {
       this.studentModule = ng.module(EcStudentModule.moduleId, ['ngTable'])
            .controller(assessments.controllerId, assessments);
    }
}