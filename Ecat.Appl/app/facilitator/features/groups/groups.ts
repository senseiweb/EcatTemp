﻿import ICommon from 'core/service/common'
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


    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Facilitator Groups Loaded');
        this.activate();
    }

    activate(): void {
       

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