import IDataCtx from "core/service/data/context"

export default class EcStudentAssessmentAddCommentForm {
    static controllerId = 'app.student.assessment.comment';
    static $inject = ['$uibModalInstance',IDataCtx.serviceId];

    nf: angular.IFormController;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx) {
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }
    
    ok(): void {
        
    }
}