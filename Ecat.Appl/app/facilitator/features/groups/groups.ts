import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import * as appVars from 'appVars'
import IViewStatus from 'facilitator/features/groups/modals/status';
import IAssessmentAdd from 'core/features/assessView/modals/add'
import IAssessmentEdit from 'core/features/assessView/modals/edit'
import ICommentAe from 'core/features/assessView/modals/comment'
import ICSD from "facilitator/features/groups/modals/capstonestudentdetail"
//import IScoring from 'core/service/scoring'

//interface IResultsAverages {
//    [groupMemberId: number]: IAssesseeSpAverages
//}

//interface IAssesseeSpAverages {
//    self: string,
//    peer: string,
//    fac: string
//}

interface IGroupCapstone {
    [studentId: number]: IStudentCapstone
}

interface IStudentCapstone {
    [groupType: string]: IStudentGroupResults;
}

interface IStudentGroupResults {
    strat: number,
    self: string,
    peer: string,
    fac: string
}

interface INewStrat {
    [assesseeId: number]: number
}

export default class EcInstructorGroups {
    static controllerId = 'app.facilitator.features.groups';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];

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
    }
    //#endregion

    assessmentForm: angular.IFormController;

    courses: ecat.entity.ICourseMember[] = [];
    selectedCourse: Ecat.Shared.Model.Course;
    selectedGroup: ecat.entity.IFacWorkGroup;
    //selectedGroup: ecat.entity.IWorkGroup;
    selectedStudent: ecat.entity.IMemberInGroup;
    selectedComment: Ecat.Shared.Model.SpComment;
    publishStatus = {
        commentsComplete: false,
        stratsComplete: false
    };
    radioCommentFlag: string;
    orderBy: string;
    //resultsAverages: IResultsAverages = {};
    groupCapstoneData: IGroupCapstone = {};
    capstoneStudents: ecat.entity.ICourseMember[] = [];
    groupTypes: string[] = [];
    strats: INewStrat = {};

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
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

                this.selectedCourse.groups.forEach(grp => {
                    var found = this.groupTypes.some(gt => {
                        if (gt === grp.mpCategory) { return true; }
                    });
                    if (!found) { this.groupTypes.push(grp.mpCategory); }
                });
            });

        function sortCourseMems(first: ecat.entity.ICourseMember, second: ecat.entity.ICourseMember) {
            if (first.course.startDate < second.course.startDate) { return 1 }
            if (first.course.startDate > second.course.startDate) { return -1 }
            if (first.course.startDate === second.course.startDate) { return 0 }
        }


        this.orderBy = '';

    }

    changeCourse(selectedCourse: ecat.entity.ICourseMember): void {
        this.selectedCourse = selectedCourse.course;
        this.dCtx.facilitator.activateCrseMemId = this.selectedCourse.id;
    }

    selectGroup(selected: Ecat.Shared.Model.WorkGroup, type: string): void {
        this.dCtx.facilitator.getMemberByGroupId()
            .then((retData: ecat.entity.IFacWorkGroup) => {
                this.selectedGroup = retData;
                this.dCtx.facilitator.activeGroupId = this.selectedGroup.id;
                this.setUpView(type);
            });
    }

    setUpView(type: string): void {
        switch (type) {
            case 'status':
                //this.spStatuses = this.scoreService.calcStudentSpStatus(this.group);
                break;
            case 'assess':
                //this.selectedGroup.groupMembers.forEach(gm => {
                //    var comment = this.selectedGroup.facSpComments.filter(com => {
                //        if (com.recipientId === gm.id) {
                //            return true;
                //        }
                //        return false;
                //    });

                //    if (comment === undefined) {
                //        this.facHasComments[gm.id] = false;
                //    } else {
                //        this.facHasComments[gm.id] = true;
                //    }
                //});
                break;
            case 'publish':
                this.checkPublish();
                break;
            case 'results':
                this.setUpResults();
                break;
            case 'capstone':
                this.setUpCapstone();
                break;
        }
    }

    massFlagUnflagged(): void {
        this.selectedGroup.groupMembers.forEach(gm => {
            gm.authorOfComments.forEach(aoc => {
                if (aoc.mpCommentFlagFac === null) {
                    aoc.mpCommentFlagFac = appVars.MpCommentFlag.neut;
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
                aoc.mpCommentFlagFac = appVars.MpCommentFlag.neut;
                aoc.facFlaggedById = this.dCtx.user.persona.personId;
            });
        });
        this.publishStatus.commentsComplete = true;
    }

    checkPublish(): void {
        if (this.selectedGroup.mpSpStatus === appVars.MpSpStatus.open) {
            this.selectedGroup.mpSpStatus = appVars.MpSpStatus.underReview;
            this.publishStatus.commentsComplete = false;
            this.publishStatus.stratsComplete = false;
        } else if (this.selectedGroup.mpSpStatus === appVars.MpSpStatus.underReview) {
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

            if (unstrattedStudents.length > 0) {
                this.publishStatus.stratsComplete = false;
            }
        }
    }

    setUpStrats(): void {
        this.selectedGroup.groupMembers.forEach(gm => {
            var foundStrat = false;
            foundStrat = this.selectedGroup.facStratResponses.some(strat => {
                if (strat.assesseeId === gm.id) { return true; }
            });

            if (!foundStrat) {
                this.selectedGroup.facStratResponses.push(this.dCtx.facilitator.getNewFacStrat(this.selectedGroup, gm));
            }
        });
    }

    viewDetails(): void {
        //this.memberResults = this.scoreService.calcInventoryOveralls(this.selectedStudent);

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

    setUpResults(): void {
        //this.selectedGroup.groupMembers.forEach(gm => {
        //    var assesseeAv: IAssesseeSpAverages = {
        //        self: '',
        //        peer: '',
        //        fac: ''
        //    }
        //    var selfAgg: number = 0;
        //    var peerAgg: number = 0;
        //    var facAgg: number = 0;
        //    gm.assesseeSpResponses.forEach(resp => {
        //        if (resp.assesseeId === gm.id) {
        //            selfAgg += resp.itemModelScore;
        //        } else {
        //            peerAgg += resp.itemModelScore;
        //        }
        //    });

        //    var facResponses = this.selectedGroup.facSpResponses.filter(resp => {
        //        if (resp.assesseeId === gm.id) { return true; }
        //        return false;
        //    });

        //    facResponses.forEach(resp => {
        //        facAgg += resp.itemModelScore;
        //    });


        //});
    }

    savePublish(): void {
        var stratsCheck = true;
        var stratList: number[] = [];
        this.selectedGroup.groupMembers.forEach(gm => {
            var found = false;
            found = this.selectedGroup.facStratResponses.some(strat => {
                if (strat.assesseeId === gm.id) { return true; }
            });

            if (!found) {
                stratsCheck = false;
            } else {
                if (this.strats[gm.id] !== null || this.strats[gm.id] !== undefined) {
                    stratList.push(this.strats[gm.id]);
                } else {
                    stratsCheck = false;
                }
            }
        });
        
        if (stratsCheck) {
            stratList.sort((first: number, second: number) => {
                if (first === second) {
                    stratsCheck = false;
                    return 0;
                }
            });
        }

        if (stratsCheck) {

        }

        this.selectedGroup.groupMembers.forEach(gm => {
            if (this.strats[gm.id] !== null || this.strats[gm.id] !== undefined) {
                var studentStrat = this.selectedGroup.facStratResponses.filter(strat => {
                    if (strat.assesseeId === gm.id) {
                        return true;
                    }
                });

                if (studentStrat[0] !== undefined) {

                }
                studentStrat[0].stratPosition = this.strats[gm.id];
            }
        });

        this.save();
    }

    cancelPublish(): void {
        const self = this;
        const cancelAlertSettings: SweetAlert.Settings = {
            title: 'Cancel Publication',
            text: 'Canceling will reopen the group and allow students to make changes. Are you sure you want to cancel?',
            type: 'warning',
            confirmButtonText: 'Cancel Publication',
            closeOnConfirm: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
            showCancelButton: true
        }

        this.c.swal(cancelAlertSettings, afterCancelPublish);

        function afterCancelPublish(confirmed: boolean) {
            if (!confirmed) { return; }
            self.selectedGroup.mpSpStatus = appVars.MpSpStatus.open;
            self.save();
        }
    }

    publish(): void {
        this.checkPublish();
        const self = this;
        if (this.publishStatus.commentsComplete && this.publishStatus.stratsComplete) {
            const publishAlertSettings: SweetAlert.Settings = {
                title: 'Publish Group',
                text: 'Publishing is final, you cannot change anything after this is completed. Are you sure you want to publish?',
                type: 'warning',
                confirmButtonText: 'Publish',
                closeOnConfirm: true,
                allowEscapeKey: true,
                allowOutsideClick: true,
                showCancelButton: true
            }

            this.c.swal(publishAlertSettings, afterPublishConfirmClose);
        } else {
            const incompleteAlertSettings: SweetAlert.Settings = {
                title: 'Review Incomplete',
                text: 'You have not completed the group review,',
                type: 'error',
                confirmButtonText: 'Continue Review',
                closeOnConfirm: true,
                allowEscapeKey: true,
                allowOutsideClick: true,
                showCancelButton: false
            }

            if (!this.publishStatus.commentsComplete) {
                incompleteAlertSettings.text += ' not all comments are flagged';
            }
            if (!this.publishStatus.stratsComplete) {
                if (!this.publishStatus.commentsComplete) { incompleteAlertSettings.text += ' and' }
                incompleteAlertSettings.text += ' you have not completed all stratifications'
            }
            incompleteAlertSettings.text += '.';

            this.c.swal(incompleteAlertSettings, afterIncompleteConfirmClose);
        }

        function afterPublishConfirmClose(confirmed: boolean) {
            if (!confirmed) {
                return;
            }
            self.selectedGroup.mpSpStatus = appVars.MpSpStatus.published;
            self.save();
        }

        function afterIncompleteConfirmClose(confirmed: boolean) {
            if (confirmed) {
                return;
            }
        }
    }

    setUpCapstone(): void {
        const self = this;
        this.dCtx.facilitator.getCapstoneData()
            .then((retData: Array<ecat.entity.ICourseMember>) => gotCapstoneData(retData));

        function gotCapstoneData(retData: Array<ecat.entity.ICourseMember>): void {
            self.capstoneStudents = retData;
            self.capstoneStudents.forEach(cm => {
                var studentCapstoneData: IStudentCapstone = {};
                cm.studGroupEnrollments.forEach(gm => {
                    var groupResults: IStudentGroupResults = {
                        strat: 0,
                        self: '',
                        peer: '',
                        fac: ''
                    }
                    groupResults.strat = gm.stratResults[0].finalStratPosition;
                    //groupResults.self = gm.assessResults[0].self;
                    //groupResults.peer = gm.assessResults[0].peer;
                    //groupResults.fac = gm.assessResults[0].fac;

                    studentCapstoneData[gm.group.mpCategory] = groupResults;
                });
                self.groupCapstoneData[cm.id] = studentCapstoneData;
            });
        }
    }

    save(): void {
        const self = this;
        this.dCtx.facilitator.saveChanges()
            .then(saveReturn)
            .catch(saveRejected);

        function saveReturn(ret: breeze.SaveResult): void {
            
        }

        function saveRejected(reason: any): void {
            if (reason) {

            }
        }
    }

    //#region modal calls
    viewStatus(): void {
        this.uiModal.open(this.statusModalOptions);
    }

    viewCapstoneStudentDetails(student: ecat.entity.IMemberInGroup): void {
        this.selectedStudent = student;
        this.dCtx.facilitator.selectedStudentCMId = this.selectedStudent.courseEnrollmentId;
        this.uiModal.open(this.capstoneStudentDetailModalOptions);
    }

    addAssessment(assessee: ecat.entity.IMemberInGroup): void {
        const self = this;
        var spResponses: ecat.entity.IFacSpAssess[] = [];
        this.selectedGroup.assignedSpInstr.inventoryCollection.forEach(inv => {
            var newResponse = this.dCtx.facilitator.getNewFacSpAssessResponse(this.selectedGroup, assessee, inv);
            spResponses.push(newResponse);
        });

        this.addModalOptions.resolve = {
            mode: () => 'facilitator',
            assessment: () => spResponses
        };

        this.uiModal.open(this.addModalOptions)
            .result
            .then(retData => assessmentSaved(retData))
            .catch(assessmentError);

        function assessmentSaved(retData: ecat.entity.IFacSpAssess[]) {
            retData.forEach(resp => {
                self.selectedGroup.facSpResponses.push(resp);
            });

            self.save();
        }

        function assessmentError() {


        }
    }

    editAssessment(assessee: ecat.entity.IMemberInGroup): void {
        const self = this;
        var spResponses = this.selectedGroup.facSpResponses.filter(resp => {
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
            .then(retData => assessmentSaved(retData))
            .catch(assessmentError);

        function assessmentSaved(retData: ecat.entity.IFacSpAssess[]) {
            self.save();
        }

        function assessmentError() {
            
        }

    }

    addComment(recipient: ecat.entity.IMemberInGroup): void {
        const self = this;
        var comment = this.dCtx.facilitator.getNewFacComment(this.selectedGroup, recipient);

        this.commentModalOptions.resolve = {
            mode: () => 'facilitator',
            //comment: () => comment
        };

        this.uiModal.open(this.commentModalOptions)
            .result
            .then(retData => commentSaved(retData))
            .catch(commentError);

        function commentSaved(retData: any) {
            self.selectedGroup.facSpComments.push(retData);
            self.selectedGroup.statusOfStudent[recipient.id].hasComment = true;
            self.save();
        }

        function commentError() {


        }

    }

    editComment(recipient: ecat.entity.IMemberInGroup): void {
        const self = this;
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
            .then(retData => commentSaved(retData))
            .catch(commentError);

        function commentSaved(retData: any) {
            self.save();
        }

        function commentError() {


        }
    }
    //#endregion
}