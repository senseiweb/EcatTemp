import IDataCtx from "core/service/data/context"

export default class EcStudentAssessmentAddForm {
    static controllerId = 'app.student.assessment.formEdit';
    static $inject = ['$uibModalInstance',IDataCtx.serviceId];

    nf: angular.IFormController;

    questions: Array<string>;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx) {
        console.log('Assessment Loaded');
        this.activate();
    }

    activate(): void {

        
        this.questions = [
            "controlled emotions and impulses while adapting to changing circumstances",
            "Did awesome things at the expense of others",
            "Was load and obnoxious",
            "Encouraged others to participate",
            "Contributed to the group in a positive way"
        ];


    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {
        
    }

    alert(): void {

        alert('Failure');
    }
}