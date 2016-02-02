import ICommon from 'core/service/common'
import IDataCtx from "core/service/data/context";
import IAssessmentAe from 'student/assessments/addEdit'


export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uiModal', ICommon.serviceId, IDataCtx.serviceId]; 

    aeModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAssessmentAe.controllerId,
        controllerAs: 'assessAe',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/student/assessment/addEdit.html'

    };

    assessmentForm: angular.IFormController;

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Assessment Loaded');
    }

    addAssessment(): void {
        this.uiModal.open(this.aeModalOptions)
            .result
            .then(assessmentSaved)
            .catch(assessmentError);

        function assessmentSaved() {
            
        }

        function assessmentError() {
            

        }

    }
}