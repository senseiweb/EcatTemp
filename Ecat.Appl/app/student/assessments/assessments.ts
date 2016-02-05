import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IAssessmentAdd from 'student/assessments/modals/add'
import IAssessmentEdit from 'student/assessments/modals/edit'
import IComment from 'student/assessments/modals/comment'
//import {EcMapGender as gender} from "appVars"

export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];
    stratInputVis;

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

    courses: Array<string> = [];

    fullName = 'Unknown';

    groupMembers: Array<{}> = [];

    courseEnrollments: ecat.entity.ICourseMember[] = [];


    user: ecat.entity.IPerson;

    questions: Array<{}>;

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Assessment Loaded');
        this.activate();
    }

    activate(): void {
        this.user = this.dCtx.user.persona;
        this.fullName = `${this.user.firstName} ${this.user.lastName}'s`;
        //this.courses = ['ILE 16-1', 'ILE 16-2', 'ILE 16-3'];
        const self = this;

        this.dCtx.student.getCourses().then(recCourseList);

        function recCourseList(retData: ecat.entity.ICourseMember[]) {
            if (self.dCtx.student.activeCourse === null || self.dCtx.student.activeCourse === undefined)
            {
                self.dCtx.student.activeCourse = retData[0];
                self.dCtx.student.getAllGroupData().then(groupData => console.log(groupData));
            }
            self.courseEnrollments = retData;
            self.courseEnrollments.forEach(ce => self.courses.push(ce.course.name));
        }

        //this.groupMembers = [
        //    {
        //        id: 1,
        //        name: 'Jason Silvers'
                

                
        //    } 
        //];

        //this.questions = [
        //{
        //    id: 1,
        //    question: 'controlled emotions and impulses while adapting to changing circumstances',
        //    assessAvg: 'Always Highly Effective',
        //    counts: 'IE: 4   E: 4   HE: 5'
        //}, {
        //    id: 2,
        //    question: 'Did awesome things at the expense of others',
        //    assessAvg: 'Frequently Effective',
        //    counts: 'IE: 4   E: 4   HE: 5'
        //}, {
        //    id: 3,
        //    question: 'Was load and obnoxious',
        //    assessAvg: 'Frequently Effective',
        //    counts: 'IE: 4   E: 4   HE: 5'
        //}, {
        //    id: 4,
        //    question: 'Encouraged others to participate',
        //    assessAvg: 'Frequently Effective',
        //    counts: 'IE: 4   E: 4   HE: 5'
        //}, {
        //    id: 5,
        //    question: 'Contributed to the group in a positive way',
        //    assessAvg: 'Frequently Effective',
        //    counts: 'IE: 4   E: 4   HE: 5'
        //}
        //];

        this.stratInputVis = false;

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

    get viewStrat(): boolean {
        return true;
    }
}