import ng = require('angular')
import 'ngTable'
import assessments from 'student/assessments/assessments'
import addAssess from "student/assessments/modals/add"
import addComment from "student/assessments/modals/comment"
import editAssess from "student/assessments/modals/edit"

export default class EcStudentModule {
    static moduleId = 'student';
    studentModule: angular.IModule;
    constructor() {
        this.studentModule = ng.module(EcStudentModule.moduleId, ['ngTable'])
            .controller(assessments.controllerId, assessments)
            .controller(addAssess.controllerId, addAssess)
            .controller(addComment.controllerId, addComment)
            .controller(editAssess.controllerId, editAssess);
    }
}