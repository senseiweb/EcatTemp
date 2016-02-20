import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import * as appVars from 'appVars'
import IViewStatus from 'facilitator/features/groups/modals/status';
import IAssessmentAdd from 'core/features/assessView/modals/add'
import IAssessmentEdit from 'core/features/assessView/modals/edit'
import ICommentAe from 'core/features/assessView/modals/comment'
import ICSD from "facilitator/features/groups/modals/capstonestudentdetail"
import IScoring from 'core/service/scoring'


export interface IInventoryWithOveralls {
    inventory: Ecat.Shared.Model.SpInventory;
    self: string;
    peerOverall: string;
    fac: string;
}

export default class EcInstructorGroups {
    static controllerId = 'app.facilitator.features.groups';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId, IScoring.serviceId];

    //#region modal options
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

    commentModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: ICommentAe.controllerId,
        controllerAs: 'commentAe',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/core/features/assessView/modals/comment.html'

    };

    statusModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IViewStatus.controllerId,
        controllerAs: 'viewStatus',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/facilitator/features/groups/modals/status.html',
        size: 'lg',
        resolve: { selectedGroup: () => this.selectedGroup }
    }

    capstoneStudentDetailModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: ICSD.controllerId,
        controllerAs: 'csd',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/facilitator/features/groups/modals/capstonestudentdetail.html',
        size: 'lg',
        resolve: { selectedStudent: () => this.selectedStudent }
    }
    //#endregion

    assessmentForm: angular.IFormController;

    courses: ecat.entity.ICourseMember[] = [];
    selectedCourse: Ecat.Shared.Model.Course;
    selectedGroup: Ecat.Shared.Model.WorkGroup;
    //selectedGroup: ecat.entity.IWorkGroup;
    selectedStudent: Ecat.Shared.Model.MemberInGroup;
    selectedComment: Ecat.Shared.Model.SpComment;
    publishStatus = {
        commentsComplete: false,
        stratsComplete: false
    };
    radioCommentType: string;
    orderyBy: string;
    memberResults: ecat.IInventoryWithOveralls[] = []

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx, private scoreService: IScoring) {
        console.log('Facilitator Groups Loaded');
        this.activate();
    }

    activate(): void {
        this.dCtx.facilitator.initializeCourses(false)
            .then((retData: ecat.entity.ICourseMember[]) => {
                retData = retData.sort(sortCourseMems);
                this.courses = retData;
                this.selectedCourse = this.courses[0].course;
                this.dCtx.facilitator.activateCrseMemId = this.selectedCourse.id;
                console.log(this.courses);
                console.log(this.selectedCourse);
            });

        function sortCourseMems(first: ecat.entity.ICourseMember, second: ecat.entity.ICourseMember) {
            if (first.course.startDate < second.course.startDate) { return 1 }
            if (first.course.startDate > second.course.startDate) { return -1 }
            if (first.course.startDate === second.course.startDate) { return 0 }
        }


        this.orderyBy = '';

    }

    selectGroup(selected: Ecat.Shared.Model.WorkGroup, type: string): void {
        this.selectedGroup = selected;
        this.dCtx.facilitator.activeGroupId = this.selectedGroup.id;

        this.dCtx.facilitator.getMemberByGroupId();

        switch (type) {
            case 'status':
                //this.spStatuses = this.scoreService.calcStudentSpStatus(this.group);
                break;
            case 'assess':
                //this.scoreService.calcFacAssessStatus(this.selectedGroup);
                break;
            case 'publish':
                //this.checkPublish(this.selectedGroup);
                break;
            case 'results':
                //this.scoreService.calcGroupResults(this.selectedGroup);
                break;
            case 'capstone':
                break;
        }

        //if (this.selectedGroup.id !== selected.id && this.selectedGroup.groupMembers.length === 0) {
        //this.dCtx.facilitator.getGroupData(false)
        //    .then((retData: ecat.entity.IWorkGroup) => {
        //        this.selectedGroup = retData;
        //        this.dCtx.facilitator.activeGroupId = this.selectedGroup.id;
        //    });
        //}
    }

    massFlagUnflagged(): void {
        this.selectedGroup.groupMembers.forEach(gm => {
            gm.authorOfComments.forEach(aoc => {
                if (aoc.mpCommentFlagFac === null) {
                    aoc.mpCommentFlagFac = 'Neutral';
                    //handle flaggedBy on the server when saving?
                    aoc.facFlaggedById = this.dCtx.user.persona.personId;
                }
            });
        }); 
        this.publishStatus.commentsComplete = true;
    }

    massFlagReset(): void {
        this.selectedGroup.groupMembers.forEach(gm => {
            gm.authorOfComments.forEach(aoc => {
                aoc.mpCommentFlagFac = 'Neutral';
                aoc.facFlaggedById = this.dCtx.user.persona.personId;
            });
        });
        this.publishStatus.commentsComplete = true;
    }

    checkPublish(): void {
        if (this.selectedGroup.mpSpStatus === appVars.MpSpStatus.open) {
            this.selectedGroup.mpSpStatus = appVars.MpSpStatus.underReview;
        } else if (this.selectedGroup.mpSpStatus === appVars.MpSpStatus.underReview) {
            //var unflagged = this.selectedGroup.groupMembers.forEach(gm => {
            //    var 
            //});

            this.selectedGroup.groupMembers.forEach(gm => {
                //var unflaggedComments = gm.authorOfComments.some(aoc => {
                //    if (aoc.mpCommentFlagFac === null || aoc.mpCommentFlagFac === undefined) {
                //        return true;
                //    }
                //});
                var unflaggedComments = gm.authorOfComments.filter(aoc => {
                    if (aoc.mpCommentFlagFac === null) {
                        return true;
                    }
                    return false;
                });

                if (unflaggedComments.length > 0) {
                //if (unflaggedComments) {
                    this.publishStatus.commentsComplete = false;
                }
            });

            //var unstrattedStudents = this.selectedGroup.groupMembers.some(gm => {
            //    var notInFacStrats = this.selectedGroup.facStratResponses.some(strat => {
            //        if (strat.assesseeId === gm.id) {
            //            return false;
            //        }
            //    });
            //    if (notInFacStrats) {
            //        return true;
            //    }
            //});

            var unstrattedStudents = this.selectedGroup.groupMembers.filter(gm => {
                this.selectedGroup.facStratResponses.forEach(strat => {
                    if (strat.assesseeId === gm.id) {
                        return false;
                    }
                });
                return true;
            });

            if (unstrattedStudents) {
                this.publishStatus.stratsComplete = false;
            }
        }
    }

    viewDetails(): void {
        this.memberResults = this.scoreService.calcInventoryOveralls(this.selectedStudent);

        //this.selectedGroup.spInstrument.inventoryCollection.forEach(inv => {
        //    var invWithOv: IInventoryWithOveralls;
        //    invWithOv.inventory = inv;
        //    var peerAggregate = 0;

        //    this.selectedStudent.assesseeSpResponses.forEach(spr => {
        //        if (spr.inventoryItemId === inv.id) {
        //            if (spr.assessorId === spr.assesseeId) {
        //                invWithOv.self = this.getResultString(spr.itemModelScore);
        //            } else {
        //                peerAggregate += spr.itemModelScore;
        //            }
        //        }
        //    });

        //    invWithOv.peerOverall = this.getResultString(peerAggregate / (this.selectedGroup.groupMembers.length - 1));

        //    this.selectedStudent.group.facSpReponses.forEach(spr => {
        //        if (spr.relatedInventoryId === inv.id) {
        //            if (spr.assesseeId === this.selectedStudent.id) {
        //                invWithOv.fac = this.getResultString(spr.itemResponseScore);
        //            }
        //        }
        //    });

        //    this.memberResults.push(invWithOv);
        //});
    }

    getResultString(respScore: number): string {
        if (respScore < -1) { return 'Ineffective Always'; }
        if (respScore >= -1 && respScore < 0) { return 'Ineffective Usually'; }
        if (respScore >= 0 && respScore < 1) { return 'Not Displayed'; }
        if (respScore >= 1 && respScore < 2) { return 'Effective Usually'; }
        if (respScore >= 2 && respScore < 3) { return 'Effective Always'; }
        if (respScore >= 3 && respScore < 4) { return 'Highly Effective Usually'; }
        if (respScore >= 4) { return 'Highly Effective Always'; }

        //switch (respScore) {
        //    case :

        //}
    }

    save(): void {
        if (this.publishStatus.commentsComplete === false) {
            var flaggedAll = true;
            this.selectedGroup.groupMembers.forEach(gm => {
                gm.authorOfComments.forEach(aoc => {
                    if (!aoc.mpCommentFlagFac) {
                        flaggedAll = false;
                    }
                });
            });

            if (flaggedAll) { this.publishStatus.commentsComplete = true; }
        }

        if (this.publishStatus.stratsComplete === false) {
            if (this.selectedGroup.facStratResponses.length === this.selectedGroup.groupMembers.length) {
                this.publishStatus.stratsComplete = true;
            }
        }
    }

    viewStatus(): void {
        this.uiModal.open(this.statusModalOptions);
    }

    viewCapstoneStudentDetails(): void {
        this.uiModal.open(this.capstoneStudentDetailModalOptions);
    }


    addAssessment(assessee: Ecat.Shared.Model.MemberInGroup): void {
        var spResponses: ecat.entity.IFacSpAssess[] = [];
        this.selectedGroup.assignedSpInstr.inventoryCollection.forEach(inv => {
            var newResponse = this.dCtx.facilitator.getNewFacSpAssessResponse(this.selectedGroup.id, assessee.id, inv.id);
            spResponses.push(newResponse);
        });

        this.addModalOptions.resolve = {
            mode: () => 'facilitator',
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

    editAssessment(assessee: Ecat.Shared.Model.MemberInGroup): void {
        var spResponses = this.selectedGroup.facSpReponses.filter(resp => {
            if (resp.assesseeId === assessee.id) {
                return true;
            }
            return false;
        });

        this.editModalOptions.resolve = {
            mode: () => 'facilitator',
            assessment: () => spResponses
        };

        this.uiModal.open(this.editModalOptions)
            .result
            .then(modalData => assessmentSaved(modalData))
            .catch(assessmentError);

        function assessmentSaved(retData: any) {
            
        }

        function assessmentError() {
            
        }

    }

    addComment(recipient: Ecat.Shared.Model.MemberInGroup): void {
        //var comment = this.dCtx.facilitator.getNewFacComment(this.selectedGroup.id, recipient.id);

        this.commentModalOptions.resolve = {
            mode: () => 'facilitator',
            //comment: () => comment
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

    editComment(recipient: Ecat.Shared.Model.MemberInGroup): void {
        var comment = this.selectedGroup.facSpComments.filter(com => {
            if (com.recipientId === recipient.id) {
                return true;
            }
            return false;
        });

        this.commentModalOptions.resolve = {
            mode: () => 'facilitator',
            comment: () => comment[0]
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


}