import ng = require('angular')
import 'ngTable'
import assessments from 'student/assessments/assessments'
import addEditAssess from "student/assessments/addEdit"
import addComment from "student/assessments/comment"

export default class EcStudentModule {
    static moduleId = 'student';
    studentModule: angular.IModule;
    constructor() {
        this.studentModule = ng.module(EcStudentModule.moduleId, ['ngTable'])
            .controller(assessments.controllerId, assessments)
            .controller(addEditAssess.controllerId, addEditAssess)
            .controller(addComment.controllerId, addComment);

    }
}