import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';

export default class EcInstructorGroups {
    static controllerId = 'app.facilitator.features.groups';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];
    stratInputVis;

    //addModalOptions: angular.ui.bootstrap.IModalSettings = {
    //    controller: IAssessmentAdd.controllerId,
    //    controllerAs: 'assessAdd',
    //    bindToController: true,
    //    keyboard: false,
    //    backdrop: 'static',
    //    templateUrl: 'wwwroot/app/student/assessments/modals/add.html'

    //};

    //editModalOptions: angular.ui.bootstrap.IModalSettings = {
    //    controller: IAssessmentEdit.controllerId,
    //    controllerAs: 'assessEdit',
    //    bindToController: true,
    //    keyboard: false,
    //    backdrop: 'static',
    //    templateUrl: 'wwwroot/app/student/assessments/modals/edit.html'

    //};


    //assessmentForm: angular.IFormController;

    //commentModalOptions: angular.ui.bootstrap.IModalSettings = {
    //    controller: IComment.controllerId,
    //    controllerAs: 'commentAe',
    //    bindToController: true,
    //    keyboard: false,
    //    backdrop: 'static',
    //    templateUrl: 'wwwroot/app/student/assessments/modals/comment.html'

    //};

    groups: Array<{}>;


    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Facilitator Groups Loaded');
        this.activate();
    }

    activate(): void {
        this.groups = [
            {
                id: 1,
                flight: 'flight 1'
            }, {
                id: 2,
                flight: 'flight 2'
            }, {
                id: 3,
                flight: 'flight 3'
            }, {
                id: 4,
                flight: 'flight 4'
            }, {
                id: 5,
                flight: 'flight 5'
            }, {
                id: 6,
                flight: 'flight 6'
            }, {
                id: 7,
                flight: 'flight 7'
            }, {
                id: 8,
                flight: 'flight 8'
            },
        ];

    }

    //addAssessment(): void {
    //    this.uiModal.open(this.addModalOptions)
    //        .result
    //        .then(assessmentSaved)
    //        .catch(assessmentError);

    //    function assessmentSaved() {
            
    //    }

    //    function assessmentError() {
            

    //    }


    //}

    //editAssessment(): void {
    //    this.uiModal.open(this.editModalOptions)
    //        .result
    //        .then(assessmentSaved)
    //        .catch(assessmentError);

    //    function assessmentSaved() {

    //    }

    //    function assessmentError() {
            
    //    }

    //}

    //addComment(): void {
    //    this.uiModal.open(this.commentModalOptions)
    //        .result
    //        .then(commentSaved)
    //        .catch(commentError);

    //    function commentSaved() {

    //    }

    //    function commentError() {


    //    }

    //}


}