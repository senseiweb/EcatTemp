import IDataCtx from "core/service/data/context"

export default class EcAssessmentAddForm {
    static controllerId = 'app.core.assessment.formEdit';
    static $inject = ['$uibModalInstance',IDataCtx.serviceId];

    nf: angular.IFormController;

    questions: Array<{}>;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx) {
        console.log('Assessment Loaded');
        this.activate();
    }

    activate(): void {

        
        this.questions = [
        {
            id: 1,
            question:
                "controlled emotions and impulses while adapting to changing circumstances"
        }, {
            id: 2,
            question: "Did awesome things at the expense of others"
        }, {
            id: 3,
            question: "Was load and obnoxious"
        }, {
            id: 4,
            question: "Encouraged others to participate"
        }, {
                id: 5,
                question: "Contributed to the group in a positive way"
            }
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