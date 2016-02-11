import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IAssessmentAdd from 'core/features/assessView/modals/add'
import IAssessmentEdit from 'core/features/assessView/modals/edit'
import ICommentAe from 'core/features/assessView/modals/comment'


export default class EcInstructorGroups {
    static controllerId = 'app.facilitator.features.groups';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];
    stratInputVis;

    addModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAssessmentAdd.controllerId,
        controllerAs: 'assessAdd',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        resolve: { mode: () => 'facilitator' },
        templateUrl: 'wwwroot/app/core/features/assessView/modals/add.html'

    };

    editModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAssessmentEdit.controllerId,
        controllerAs: 'assessEdit',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        resolve: { mode: () => 'facilitator' },
        templateUrl: 'wwwroot/app/core/features/assessView/modals/edit.html'

    };


    assessmentForm: angular.IFormController;

    commentModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: ICommentAe.controllerId,
        controllerAs: 'commentAe',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/core/features/assessView/modals/comment.html'

    };

    groups: Array<{}>;
    results: Array<{}>;
    questions: Array<{}>;


    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Facilitator Groups Loaded');
        this.activate();
    }

    activate(): void {

        this.questions = [
            {
                id: 1,
                question: 'controlled emotions and impulses while adapting to changing circumstances',
                assessAvg: 'Always Highly Effective',
                counts: 'IE: 4   E: 4   HE: 5'
            }, {
                id: 2,
                question: 'Did awesome things at the expense of others',
                assessAvg: 'Frequently Effective',
                counts: 'IE: 4   E: 4   HE: 5'
            }, {
                id: 3,
                question: 'Was load and obnoxious',
                assessAvg: 'Frequently Effective',
                counts: 'IE: 4   E: 4   HE: 5'
            }, {
                id: 4,
                question: 'Encouraged others to participate',
                assessAvg: 'Frequently Effective',
                counts: 'IE: 4   E: 4   HE: 5'
            }, {
                id: 5,
                question: 'Contributed to the group in a positive way',
                assessAvg: 'Frequently Effective',
                counts: 'IE: 4   E: 4   HE: 5'
            }
        ];

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
            }
        ];

        this.results = [
            {
                student: 'Bob Anderson',
                self: 'Always Highly Effective',
                peer: 'Usually Effective',
                inst: 'Sometimes Effective',
                strat: '1'
            }, {
                student: 'jane Doe',
                self: 'Always Highly Effective',
                peer: 'Usually Effective',
                inst: 'Sometimes Effective',
                strat: '2'
            }, {
                student: 'Bob Anderson',
                self: 'Always Highly Effective',
                peer: 'Usually Effective',
                inst: 'Sometimes Effective',
                strat: '3'
            }, {
                student: 'Bob Anderson',
                self: 'Always Highly Effective',
                peer: 'Usually Effective',
                inst: 'Sometimes Effective',
                strat: '4'
            }
        ];

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