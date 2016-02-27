import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IAssessmentAdd from 'core/features/assessView/modals/add'
import IAssessmentEdit from 'core/features/assessView/modals/edit'
import ICommentAe from 'core/features/assessView/modals/comment'
import * as AppVars from "appVars"

//import {EcMapGender as gender} from "appVars"

export interface IStratPerson {
    //studentId: number;
    stratInput: number;
    error: string;
}

export interface INewStrats {
    [gmId: number]: IStratPerson
}

export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', '$scope', '$filter', ICommon.serviceId, IDataCtx.serviceId];
    appVar = AppVars;
    stratInputVis;
    hasComment = false;
    isResultPublished = false;

    activeCourseMember: ecat.entity.ICourseMember;
    activeGroupMember: ecat.entity.IMemberInGroup;
    studentSelf: ecat.entity.IMemberInGroup;
    peers: ecat.entity.IMemberInGroup[];

    sortType: string;
    sortReverse = false;

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


    stratPerson: IStratPerson;

    groupMembers: Array<{}> = [];

    stratValidation: INewStrats = {};
    stratValidationMax: number;
    stratInputContent: Array<number> = [];
    selectedComment: Ecat.Shared.Model.SpComment;
    commentFlag = AppVars.MpCommentFlag;

    //Turns logError into a log error function that is displayed to the client. 
    logError = this.c.logSuccess('Assessment Center');

    courseEnrollments: ecat.entity.ICourseMember[] = [];
    groups: ecat.entity.IMemberInGroup[] = [];

    radioEffectiveness: string;
    radioFreq: string;

    user: ecat.entity.IPerson;

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private scope: angular.IScope, private filterOrderBy: angular.IFilterOrderBy, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Assessment Loaded');
        this.activate();
    }

    activate(): void {
        //this.sortType = 'student.person.lastName'
        this.sortType = 'assess.activeGroupMember.statusOfPeer[].compositeScore';

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
                self.isolateSelf();

            })
            .catch(courseError);
            //.finally();   --Can be used to do some addtional functionality
        

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

    sortByComposite(): ecat.entity.IMemberInGroup[] {

        const self = this;

         return this.peers = this.peers.sort(sort);
             

        function sort(first: Ecat.Shared.Model.MemberInGroup, second: Ecat.Shared.Model.MemberInGroup): number {
            console.log(self.activeGroupMember.statusOfPeer[first.studentId].compositeScore);
            
            if (self.activeGroupMember.statusOfPeer[first.studentId].compositeScore === self.activeGroupMember.statusOfPeer[second.studentId].compositeScore) {
                   return 0;
            }

            if (self.activeGroupMember.statusOfPeer[first.studentId].compositeScore < self.activeGroupMember.statusOfPeer[second.studentId].compositeScore) {
                return 1;
            } else {
                return -1;
            }

        }
    }

    orderBy(type: string): void {

        if (type === "name") {
            this.filterOrderBy(this.peers, 'student.person.lastName', this.sortReverse);
        }

        if (type === "compositeScore") {
            this.sortByComposite();
        }


    }

    isolateSelf(): void {

        this.peers = this.activeGroupMember.groupPeers.filter(peer => {
            if (peer.id === this.activeGroupMember.id) {
                this.stratValidation[peer.id] = {
                    error: '',
                    stratInput: null
                };
                this.studentSelf = peer;
                return false;
            }
            this.stratValidation[peer.id] = {
                error: '',
                stratInput: null
            };
            return true;
        });

        this.stratValidationMax = Object.keys(this.stratValidation).length;
        console.log(this.stratValidationMax);
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
        this.checkIfPublished();
        this.isolateSelf();
       
    }

    cancelStrat(): void {
        this.studentSelf.groupPeers.forEach(peer => {
            this.stratValidation[peer.id].error = '';
            this.stratValidation[peer.id].stratInput = undefined;
        });
    }

    saveStrat(): void {

       var duplicates: Array <number> = [];

        console.log(this.stratValidation);

        var counts = [];
        var isError = false;


        this.studentSelf.groupPeers.forEach(peer => {
            this.stratValidation[peer.id].error = '';
            
            if (this.stratValidation[peer.id].stratInput > this.stratValidationMax) {
                this.stratValidation[peer.id].error = 'Strat too large';
                isError = true;
            }

            if (this.stratValidation[peer.id].stratInput < 1) {
                this.stratValidation[peer.id].error = 'Strat too small';
                isError = true;
            }
            


        });


        this.studentSelf.groupPeers.forEach(peer => {
            
            if (this.stratValidation[peer.id].stratInput === null || this.stratValidation[peer.id].stratInput === undefined || this.stratValidation[peer.id].stratInput.toString() === '') {
                this.stratValidation[peer.id].error = 'Empty';
                isError = true;
            } else {
                if (counts[this.stratValidation[peer.id].stratInput] === undefined) {
                    counts[this.stratValidation[peer.id].stratInput] = 1;
                } else {
                    counts[this.stratValidation[peer.id].stratInput] += 1;

                    if (counts[this.stratValidation[peer.id].stratInput] > 1) {
                        duplicates.push(this.stratValidation[peer.id].stratInput);
                    }
                }
            }
        });

        this.studentSelf.groupPeers.forEach(peer => {
            if (duplicates.indexOf(this.stratValidation[peer.id].stratInput) !== -1) {
                this.stratValidation[peer.id].error = 'Duplicate Value';
                isError = true;
            } 
        });


        


        console.log(this.stratValidation);


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