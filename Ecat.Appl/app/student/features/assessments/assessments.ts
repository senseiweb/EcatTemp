import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IAssessmentAdd from 'core/features/assessView/modals/add'
import IAssessmentEdit from 'core/features/assessView/modals/edit'
import ICommentAe from 'core/features/assessView/modals/comment'
import * as AppVars from "appVars"

//import {EcMapGender as gender} from "appVars"

export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];
    appVar = AppVars;

    stratInputVis;

    hasComment = false;

    isResultPublished = false;

    activeCourseMember: ecat.entity.ICourseMember;
    activeGroupMember: ecat.entity.IMemberInGroup;
    //activeGroupMember: Ecat.Shared.Model.MemberInGroup;
    studentSelf: ecat.entity.IMemberInGroup;
    peers: ecat.entity.IMemberInGroup[];

    addModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAssessmentAdd.controllerId,
        controllerAs: 'assessAdd',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/core/features/assessView/modals/add.html'

    };

    editModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAssessmentEdit.controllerId,
        controllerAs: 'assessEdit',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
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



    fullName = 'Unknown';

    groupMembers: Array<{}> = [];

    //Turns logError into a log error function that is displayed to the client. 
    logError = this.c.logSuccess('Assessment Center');

    courseEnrollments: ecat.entity.ICourseMember[] = [];
    groups: ecat.entity.IMemberInGroup[] = [];

    radioEffectiveness: string;
    radioFreq: string;

    user: ecat.entity.IPerson;

  


    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Assessment Loaded');
        this.activate();

    }

    activate(): void {
        this.user = this.dCtx.user.persona;
        this.fullName = `${this.user.firstName} ${this.user.lastName}'s`;
        const self = this;

        function courseError(error: any) {
            self.logError('There was an error loading Courses', error, true);
        }

        //This unwraps the promise and retrieves the objects inside and stores it into a local variable
        this.dCtx.student.initCourses(false)
            .then((init: ecat.entity.ICourseMember[]) => {
                this.courseEnrollments = init;
                this.courseEnrollments = this.courseEnrollments.sort(sortByDate);
                this.activeCourseMember = this.courseEnrollments[0];
                this.dCtx.student.activeCrseMemId = this.activeCourseMember.id;
                this.groups = this.activeCourseMember.studGroupEnrollments;
                this.groups = this.groups.sort(self.sortByCategory);
                this.activeGroupMember = this.groups[0];
                self.checkIfPublished();
                self.isolateSelf();

            })
            .catch(courseError);
            //.finally();   --Can be used to do some addtional functionality

        //function recCourseList(retData: ecat.entity.ICourseMember[]) {

        //    self.courseEnrollments = retData;
        //    self.courseEnrollments.forEach(ce => self.courses.push(ce.course.name));


        //}
       
        

        function sortByDate(first: ecat.entity.ICourseMember, second: ecat.entity.ICourseMember) {
            if (first.course.startDate === second.course.startDate) {
                return 0;
            }

            if (first.course.startDate < second.course.startDate) {
                return 1;
            }

            else {
                return -1;
            }

        }

        this.stratInputVis = false;

    }



    isolateSelf(): void {


        this.peers = this.activeGroupMember.groupPeers.filter(peer => {
            if (peer.id === this.activeGroupMember.id) {
                this.studentSelf = peer;
                return false;
            }
            return true;
        });

 
    }

    checkIfPublished(): void {
        if (this.activeGroupMember.group.mpSpStatus === AppVars.MpSpStatus.published) {
            this.isResultPublished = true;
        }
    }

    sortByCategory(first: Ecat.Shared.Model.MemberInGroup, second: Ecat.Shared.Model.MemberInGroup): number {
    if (first.group.mpSpStatus === AppVars.MpSpStatus.published) {
        return -1;

    } else {
        return 1;
        }

    }

    setActiveCourse(courseMember: ecat.entity.ICourseMember): void {
        this.dCtx.student.activeCrseMemId = courseMember.id;
        this.activeCourseMember = courseMember;
        this.groups = this.activeCourseMember.studGroupEnrollments;
        this.groups = this.groups.sort(this.sortByCategory);
        this.activeGroupMember = this.groups[0];
        this.isolateSelf();

    }

    setActiveGroup(groupMember: ecat.entity.IMemberInGroup): void {
        this.activeGroupMember = groupMember;
        this.isolateSelf();
    }

    addAssessment(assessee: ecat.entity.IMemberInGroup): void {
        var spResponses: ecat.entity.ISpAssess[] = [];
        var mode: string;
        this.activeGroupMember.group.assignedSpInstr.inventoryCollection.forEach(inv => {
            var newResponse = this.dCtx.student.getNewSpAssessResponse(this.activeGroupMember, assessee, inv);
            spResponses.push(newResponse);
        });

        if (assessee.id === this.studentSelf.id) {
            mode = 'self';
        } else {
            mode = 'peer';
        }

        this.addModalOptions.resolve = {
            mode: () => mode,
            assessment: () => spResponses
        };

        this.uiModal.open(this.addModalOptions)
            .result
            .then(assessmentSaved)
            .catch(assessmentError);

        function assessmentSaved() {
            
        }

        function assessmentError() {
            

        }


    }

    addComment(recipientId: number): void {

        this.commentModalOptions.resolve = {
            recipientId: () => recipientId,
            authorId: () => this.studentSelf.id
    };

        this.uiModal.open(this.commentModalOptions)
            .result
            .then(commentSaved)
            .catch(commentError);

        function commentSaved() {

        }

        function commentError() {


        }

    }

    editAssessment(assessee: ecat.entity.IMemberInGroup): void {
        var mode: string;
        if (assessee.id === this.studentSelf.id) {
            mode = 'self';
        } else {
            mode = 'peer';
        }

        this.editModalOptions.resolve = {
            mode: () => mode,
            assessment: () => assessee.assesseeSpResponses
        };

        this.uiModal.open(this.editModalOptions)
            .result
            .then(retData => assessmentSaved(retData))
            .catch(assessmentError);

        function assessmentSaved(retData: Ecat.Shared.Model.SpAssessResponse[]) {
            console.log(assessee.assesseeSpResponses);
            console.log(retData);
        }

        function assessmentError() {
            
        }

    }

    

    get viewStrat(): boolean {
        return true;
    }
}