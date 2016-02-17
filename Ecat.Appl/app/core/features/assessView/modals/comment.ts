﻿import IDataCtx from "core/service/data/context"

export default class EcStudentAssessmentAddCommentForm {
    static controllerId = 'app.student.assessment.comment';
    static $inject = ['$uibModalInstance',IDataCtx.serviceId];

    nf: angular.IFormController;

    radioComment: string;


    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx) {

        this.activate();

    }

    activate(): void {
        this.radioComment = 'neutral';
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {
        
    }
}