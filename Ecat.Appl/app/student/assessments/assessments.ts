import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IAssessmentAdd from 'student/assessments/modals/add'
import IAssessmentEdit from "student/assessments/modals/edit"
import IComment from "student/assessments/modals/comment"
//import {EcMapGender as gender} from "appVars"

export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];

    addModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAssessmentAdd.controllerId,
        controllerAs: 'assessAdd',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/student/assessments/modals/add.html'

    };

    editModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAssessmentEdit.controllerId,
        controllerAs: 'assessEdit',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/student/assessments/modals/edit.html'

    };


    assessmentForm: angular.IFormController;

    commentModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IComment.controllerId,
        controllerAs: 'commentAe',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/student/assessments/modals/comment.html'

    };

    courses: Array<string>;

    fullName = "Unknown";

    groupMembers: Array<ecat.entity.IPerson>;

    //dummyStudent: ecat.entity.IPerson = {
    //    lastName: "Silvers",
    //    firstName: "Jason",

          
    //};

    user: ecat.entity.IPerson;

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Assessment Loaded');
        this.activate();
    }

    activate(): void {
        this.user = this.dCtx.user.persona;
        this.fullName = `${this.user.firstName} ${this.user.lastName}'s`;
        this.courses = ["ILE 16-1", "ILE 16-2", "ILE 16-3"];

        this.groupMembers = [
            {
                
            } 
        ] as Array<ecat.entity.IPerson>;
    }

    addAssessment(): void {
        this.uiModal.open(this.addModalOptions)
            .result
            .then(assessmentSaved)
            .catch(assessmentError);

        function assessmentSaved() {
            
        }

        function assessmentError() {
            

        }


    }

    editAssessment(): void {
        this.uiModal.open(this.editModalOptions)
            .result
            .then(assessmentSaved)
            .catch(assessmentError);

        function assessmentSaved() {

        }

        function assessmentError() {
            
        }

    }

    addComment(): void {
        this.uiModal.open(this.commentModalOptions)
            .result
            .then(commentSaved)
            .catch(commentError);

        function commentSaved() {

        }

        function commentError() {


        }

    }
}