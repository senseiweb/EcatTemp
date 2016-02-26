import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import * as appVars from 'appVars'
import IViewStatus from 'facilitator/features/groups/modals/status';
import IAssessmentAdd from 'core/features/assessView/modals/add'
import IAssessmentEdit from 'core/features/assessView/modals/edit'
import ICommentAe from 'core/features/assessView/modals/comment'
import ICSD from "facilitator/features/groups/modals/capstonestudentdetail"
import IScore from 'core/service/scoring'

//#region Interfaces
export interface IGroupCapstone {
    [studentId: number]: IStudentCapstone
}

export interface IStudentCapstone {
    [groupType: string]: IStudentGroupResults
}

export interface IGroupResults {
    [groupMemberId: number]: IStudentGroupResults
}

export interface IStudentGroupResults {
    strat: number,
    self: string,
    peer: string,
    fac: string
}

export interface INewStrat {
    [assesseeId: number]: number
}
//#endregion

export default class EcInstructorGroups {
    static controllerId = 'app.facilitator.features.groups';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId, IScore.serviceId];

    //#region Modal Options
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
    groupCapstoneData: IGroupCapstone = {};
    groupResults: IGroupResults = {};
    invsWithOvs: ecat.IInventoriesWithOveralls = {};
    capstoneStudents: ecat.entity.ICourseMember[] = [];
    groupTypes: string[] = [];
    strats: INewStrat = {};

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx, private score: IScore) {
        this.activate(false);
    }

    activate(force: boolean): void {
        this.dCtx.facilitator.initializeCourses(force)
            .then((retData: ecat.entity.ICourseMember[]) => {
                retData = retData.sort(sortCourseMems);
                this.courses = retData;
                this.selectedCourse = this.courses[0].course;
                this.dCtx.facilitator.activateCrseMemId = this.selectedCourse.id;

                this.selectedCourse.groups.forEach(grp => {
                    var found = this.groupTypes.some(gt => {
                        if (gt === grp.mpCategory) { return true; }
                    });
                    if (!found) { this.groupTypes.push(grp.mpCategory); }
                });
                console.log('Facilitator Courses and Groups Loaded');
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

    selectGroup(selected: Ecat.Shared.Model.WorkGroup, type: string, force: boolean): void {
        this.dCtx.facilitator.getMemberByGroupId(force)
            .then((retData: ecat.entity.IFacWorkGroup) => {
                this.selectedGroup = retData;
                this.dCtx.facilitator.activeGroupId = this.selectedGroup.id;
                console.log(this.selectedGroup.groupNumber + ' ' + this.selectedGroup.defaultName + ' Loaded');
                this.setUpView(type);
            });
    }

    setUpView(type: string): void {
        switch (type) {
            case 'status': break;
            case 'assess': break;
            case 'publish': this.checkPublish(); break;
            case 'results': this.setUpResults(); break;
            case 'capstone': this.setUpCapstone(); break;
        }
    }

    refreshData(view: number): void {
        switch (view) {
            //Groups List
            case 0: this.activate(true); break;
            //Assessment
            case 1: this.selectGroup(this.selectedGroup, 'assess', true); break;
            //Publish
            case 2: this.selectGroup(this.selectedGroup, 'publish', true); break;
            //Results
            case 3: this.selectGroup(this.selectedGroup, 'results', true); break;
            //Capstone
            case 4: this.selectGroup(this.selectedGroup, 'capstone', true); break;
        }
    }

    //#region Group Results Functions
    setUpResults(): void {
        this.selectedGroup.groupMembers.forEach(gm => {
            var groupResult: IStudentGroupResults = {
                strat: 0,
                self: '',
                peer: '',
                fac: ''
            }

            groupResult.strat = gm.stratResults[0].finalStratPosition;

            var selfAgg = 0;
            var peerAgg = 0;
            var facAgg = 0;
            gm.assessResults[0].sanitizedResponses.forEach(resp => {
                //if (resp.assesseeId === gm.id) {
                    selfAgg += resp.itemModelScore;
                //} else {
                    peerAgg += resp.itemModelScore;
                //}
            });

            selfAgg = selfAgg / (this.selectedGroup.assignedSpInstr.inventoryCollection.length * 6);
            groupResult.self = this.score.getCompositeResultString(selfAgg);
            peerAgg = (peerAgg / (this.selectedGroup.groupMembers.length - 1)) / (this.selectedGroup.assignedSpInstr.inventoryCollection.length * 6);
            groupResult.peer = this.score.getCompositeResultString(peerAgg);

            var facAssess = this.selectedGroup.facSpResponses.filter(resp => {
                if (resp.assesseeId === gm.id) { return true; }
                return false;
            });

            facAgg = this.score.calcFacComposite(facAssess);
            groupResult.fac = this.score.getCompositeResultString(facAgg);

            this.groupResults[gm.id] = groupResult;
        });
    }

    viewGRDetails(): void {
        var facAssess = this.selectedGroup.facSpResponses.filter(resp => {
            if (resp.assesseeId === this.selectedStudent.id) { return true; }
            return false;
        });

        this.invsWithOvs = this.score.calcInventoryOveralls(this.selectedGroup.assignedSpInstr, this.selectedStudent.assesseeSpResponses, facAssess);
    }
    //#endregion

    //#region Publish Functions
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
            this.save();
        } else if (this.selectedGroup.mpSpStatus === appVars.MpSpStatus.underReview) {
            this.selectedGroup.groupMembers.forEach(gm => {
                var unflaggedCommentsFound = false;
                unflaggedCommentsFound = gm.authorOfComments.some(aoc => {
                    if (aoc.mpCommentFlagFac === null || aoc.mpCommentFlagFac === undefined) { return true; }
                });

                this.publishStatus.commentsComplete = !unflaggedCommentsFound;
                //if (unstrattedStudentsSome) { this.publishStatus.stratsComplete = false; }

                //var unflaggedComments = gm.authorOfComments.filter(aoc => {
                //    if (aoc.mpCommentFlagFac === null) {
                //        return true;
                //    }
                //    return false;
                //});

                //if (unflaggedComments.length > 0) {
                //    this.publishStatus.commentsComplete = false;
                //}
            });

            var unstrattedStudentsFound = false;
            unstrattedStudentsFound = this.selectedGroup.groupMembers.some(gm => {
                var inFacStrats = false;
                inFacStrats = this.selectedGroup.facStratResponses.some(strat => {
                    if (strat.assesseeId === gm.id) { return true; }
                });
                if (!inFacStrats) { return true; }
            });

            this.publishStatus.stratsComplete = !unstrattedStudentsFound;

            //if (unstrattedStudentsFound) { this.publishStatus.stratsComplete = false; }

            //var unstrattedStudents = this.selectedGroup.groupMembers.filter(gm => {
            //    this.selectedGroup.facStratResponses.forEach(strat => {
            //        if (strat.assesseeId === gm.id) {
            //            return false;
            //        }
            //    });
            //    return true;
            //});

            //if (unstrattedStudents.length > 0) {
            //    this.publishStatus.stratsComplete = false;
            //}
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

    savePublish(): void {
        //need to completely rethink how new strats are going to be tracked, this isn't very nice
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
            text: 'Canceling will open the group and allow students to make changes. Are you sure you want to cancel publication?',
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
        const publishAlertSettings: SweetAlert.Settings = {
            title: 'Publication',
            text: 'Publication Error',
            type: 'warning',
            confirmButtonText: 'Return',
            closeOnConfirm: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
            showCancelButton: false
        }
        
        if (this.publishStatus.commentsComplete && this.publishStatus.stratsComplete) {
            publishAlertSettings.title = 'Publish Group';
            publishAlertSettings.text = 'Publishing is final, you cannot change anything after this is completed. Are you sure you want to publish?';
            publishAlertSettings.confirmButtonText = 'Publish';
            publishAlertSettings.showCancelButton = true;

            this.c.swal(publishAlertSettings, afterPublishConfirmClose);
        } else {
            publishAlertSettings.title = 'Review Incomplete';
            publishAlertSettings.confirmButtonText = 'Continue Review';
            publishAlertSettings.type = 'error';
            var swalText = 'You have not completed the group review,';

            if (!this.publishStatus.commentsComplete) {
                swalText += ' not all comments are flagged';
            }
            if (!this.publishStatus.stratsComplete) {
                if (!this.publishStatus.commentsComplete) { swalText += ' and' }
                swalText += ' you have not completed all stratifications'
            }
            swalText += '.';
            publishAlertSettings.text = swalText;

            this.c.swal(publishAlertSettings, afterIncompleteConfirmClose);
        }

        function afterPublishConfirmClose(confirmed: boolean) {
            if (!confirmed) { return; }
            self.selectedGroup.mpSpStatus = appVars.MpSpStatus.published;
            self.save();
        }

        function afterIncompleteConfirmClose(confirmed: boolean) {
            return;
        }
    }
    //#endregion

    setUpCapstone(): void {
        const self = this;
        this.dCtx.facilitator.getCapstoneData(false)
            .then((retData: Array<ecat.entity.ICourseMember>) => gotCapstoneData(retData));

        function gotCapstoneData(retData: Array<ecat.entity.ICourseMember>): void {
            console.log(self.selectedGroup.groupNumber + ' ' + self.selectedGroup.defaultName + ' Capstone Data Retrieved');
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

                    var peerAgg = 0;
                    gm.groupPeers.forEach(peer => {
                        if (peer.id === gm.id) {
                            groupResults.self = self.score.getCompositeResultString(gm.statusOfPeer[peer.id].compositeScore);
                        } else {
                            peerAgg += gm.statusOfPeer[peer.id].compositeScore;
                        }
                    });

                    groupResults.peer = self.score.getCompositeResultString((peerAgg / (gm.groupPeers.length - 1)));

                    var facAssess = gm.group.facSpResponses.filter(resp => {
                        if (resp.assesseeId === gm.id) { return true; }
                        return false;
                    });

                    if (facAssess.length > 0) {
                        var facComp = (self.score.calcFacComposite(facAssess) / (gm.group.assignedSpInstr.inventoryCollection.length * 6));
                        groupResults.fac = self.score.getCompositeResultString(facComp);
                    }
                    
                    studentCapstoneData[gm.group.mpCategory] = groupResults;
                });
                self.groupCapstoneData[cm.id] = studentCapstoneData;
            });

            console.log(self.selectedGroup.groupNumber + ' ' + self.selectedGroup.defaultName + ' Capstone Data Calculated');
        }
    }

    //getResultString(respScore: number): string {
    //    if (respScore < .17) { return 'Ineffective Always'; }
    //    if (respScore >= .17 && respScore < .34) { return 'Ineffective Usually'; }
    //    if (respScore >= .34 && respScore < .5) { return 'Not Displayed'; }
    //    if (respScore >= .5 && respScore < .67) { return 'Effective Usually'; }
    //    if (respScore >= .67 && respScore < .84) { return 'Effective Always'; }
    //    if (respScore >= .84 && respScore < 1) { return 'Highly Effective Usually'; }
    //    if (respScore >= 1) { return 'Highly Effective Always'; }
    //}

    //calcFacComposite(responses: Ecat.Shared.Model.FacSpAssessResponse[]): number {
    //    var cummScore = 0;
    //    var knownResponse = appVars.EcSpItemResponse;
    //    responses.forEach(resp => {
    //        switch (resp.mpItemResponse) {
    //            case knownResponse.Iea: cummScore += 0; break;
    //            case knownResponse.Ieu: cummScore += 1; break;
    //            case knownResponse.Nd: cummScore += 2; break;
    //            case knownResponse.Ea: cummScore += 3; break;
    //            case knownResponse.Eu: cummScore += 4; break;
    //            case knownResponse.Hea: cummScore += 5; break;
    //            case knownResponse.Heu: cummScore += 6; break;
    //            default: break;
    //        }
    //    });
    //    return cummScore;
    //}

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

    //#region Modal Calls
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
            if (resp.assesseeId === assessee.id) { return true; }
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
            comment: () => comment
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
            if (com.recipientId === recipient.id) { return true; }
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