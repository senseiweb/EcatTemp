import ICommon from "core/common/commonService"
import IDataCtx from 'core/service/data/context';
import * as _mp from "core/common/mapStrings"

//import {EcMapGender as gender} from "appVars"

export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];
    appVar = _mp;

    stratInputVis;

    hasComment = false;

    isResultPublished = false;

    activeCourseMember: ecat.entity.IStudInCrse;
    activeGroupMember: ecat.entity.ICrseStudInGroup;
    //activeGroupMember: Ecat.Shared.Model.MemberInGroup;
    studentSelf: ecat.entity.ICrseStudInGroup;
    peers: ecat.entity.ICrseStudInGroup[];

    assessmentForm: angular.IFormController;
    
    fullName = 'Unknown';

    groupMembers: Array<{}> = [];

    //Turns logError into a log error function that is displayed to the client. 
    logError = this.c.logSuccess('Assessment Center');

    courseEnrollments: ecat.entity.IStudInCrse[] = [];
    groups: ecat.entity.ICrseStudInGroup[] = [];

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
        this.dCtx.student.initCourses(false);
            //.then((init: ecat.entity.IStudInCrse[]) => {
            //    this.courseEnrollments = init;
            //    this.courseEnrollments = this.courseEnrollments.sort(sortByDate);
            //    this.activeCourseMember = this.courseEnrollments[0];
            //    this.dCtx.student.activeCourseId = this.activeCourseMember.courseId;
            //    this.groups = this.activeCourseMember.studGroupEnrollments;
            //    this.groups = this.groups.sort(self.sortByCategory);
            //    this.activeGroupMember = this.groups[0];
            //    self.checkIfPublished();
            //    self.isolateSelf();
            //})
            //.catch(courseError);
        //.finally();   --Can be used to do some addtional functionality

        //function recCourseList(retData: ecat.entity.ICourseMember[]) {

        //    self.courseEnrollments = retData;
        //    self.courseEnrollments.forEach(ce => self.courses.push(ce.course.name));


        //}
       
        

        function sortByDate(first: ecat.entity.IStudInCrse, second: ecat.entity.IStudInCrse) {
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
            if (peer.studentId === this.activeGroupMember.studentId) {
                this.studentSelf = peer;
                return false;
            }
            return true;
        });


    }

    checkIfPublished(): void {
        if (this.activeGroupMember.group.mpSpStatus === _mp.MpSpStatus.published) {
            this.isResultPublished = true;
        }
    }

    sortByCategory(first: ecat.entity.ICrseStudInGroup, second: ecat.entity.ICrseStudInGroup): number {
        if (first.group.mpSpStatus === _mp.MpSpStatus.published) {
            return -1;

        } else {
            return 1;
        }

    }

    setActiveCourse(courseMember: ecat.entity.IStudInCrse): void {
        this.activeCourseMember = courseMember;
        this.groups = this.activeCourseMember.workGroupEnrollments;
        this.groups = this.groups.sort(this.sortByCategory);
        this.activeGroupMember = this.groups[0];
        this.isolateSelf();

    }

    setActiveGroup(groupMember: ecat.entity.ICrseStudInGroup): void {
        this.activeGroupMember = groupMember;
        this.isolateSelf();
    }

    addAssessment(assessee: ecat.entity.ICrseStudInGroup): void {
        var spResponses: ecat.entity.ISpRespnse[] = [];
        var mode: string;
        this.activeGroupMember.group.assignedSpInstr.inventoryCollection.forEach(inv => {
            //var newResponse = this.dCtx.student.getNewSpAssessResponse(this.activeGroupMember, assessee, inv);
            //spResponses.push(newResponse);
        });

        if (assessee.studentId === this.studentSelf.studentId) {
            mode = 'self';
        } else {
            mode = 'peer';
        }

        //this.addModalOptions.resolve = {
        //    mode: () => mode,
        //    assessment: () => spResponses
        //};

        //this.uiModal.open(this.addModalOptions)
        //    .result
        //    .then(assessmentSaved)
        //    .catch(assessmentError);

        //function assessmentSaved() {

        //}

        //function assessmentError() {


        //}


    }

    addComment(recipientId: number): void {

        //this.commentModalOptions.resolve = {
        //    recipientId: () => recipientId,
        //    authorId: () => this.studentSelf.studentId
        //};

        //this.uiModal.open(this.commentModalOptions)
        //    .result
        //    .then(commentSaved)
        //    .catch(commentError);

        //function commentSaved() {

        //}

        //function commentError() {


        //}

    }

    editAssessment(assessee: ecat.entity.ICrseStudInGroup): void {
        var mode: string;
        if (assessee.studentId === this.studentSelf.studentId) {
            mode = 'self';
        } else {
            mode = 'peer';
        }

        //this.editModalOptions.resolve = {
        //    mode: () => mode,
        //    assessment: () => assessee.assesseeSpResponses
        //};

        //this.uiModal.open(this.editModalOptions)
        //    .result
        //    .then(retData => assessmentSaved(retData))
        //    .catch(assessmentError);

        //function assessmentSaved(retData: any) {
        //    console.log(assessee.assesseeSpResponses);
        //    console.log(retData);
        //}

        //function assessmentError() {

        }

    

    //get viewStrat(): boolean {
    //    return true;
    //}
}