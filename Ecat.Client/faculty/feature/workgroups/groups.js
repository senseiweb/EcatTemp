System.register(["core/common/commonService", 'core/service/data/context', "core/common/mapStrings"], function(exports_1) {
    var commonService_1, context_1, _mp;
    var EcInstructorGroups;
    return {
        setters:[
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcInstructorGroups = (function () {
                function EcInstructorGroups(uiModal, c, dCtx) {
                    var _this = this;
                    this.uiModal = uiModal;
                    this.c = c;
                    this.dCtx = dCtx;
                    //#region modal options
                    this.addModalOptions = {
                        //controller: IAssessmentAdd.controllerId,
                        controllerAs: 'assessAdd',
                        bindToController: true,
                        keyboard: false,
                        backdrop: 'static',
                        templateUrl: '@[appCore]/feature/assessView/modals/add.html'
                    };
                    this.editModalOptions = {
                        //controller: IAssessmentEdit.controllerId,
                        controllerAs: 'assessEdit',
                        bindToController: true,
                        keyboard: false,
                        backdrop: 'static',
                        templateUrl: '@[appCore]/feature/assessView/modals/edit.html'
                    };
                    this.commentModalOptions = {
                        //controller: ICommentAe.controllerId,
                        controllerAs: 'commentAe',
                        bindToController: true,
                        keyboard: false,
                        backdrop: 'static',
                        templateUrl: '@[appCore]/feature/assessView/modals/comment.html'
                    };
                    this.statusModalOptions = {
                        //controller: IViewStatus.controllerId,
                        controllerAs: 'viewStatus',
                        bindToController: true,
                        keyboard: false,
                        backdrop: 'static',
                        templateUrl: '@[appFaculty]/feature/groups/modals/status.html',
                        size: 'lg',
                        resolve: { selectedGroup: function () { return _this.selectedGroup; } }
                    };
                    this.capstoneStudentDetailModalOptions = {
                        //controller: ICSD.controllerId,
                        controllerAs: 'csd',
                        bindToController: true,
                        keyboard: false,
                        backdrop: 'static',
                        templateUrl: '@[appFaculty]/feature/groups/modals/capstonestudentdetail.html',
                        size: 'lg',
                    };
                    this.courses = [];
                    this.publishStatus = {
                        commentsComplete: false,
                        stratsComplete: false
                    };
                    //resultsAverages: IResultsAverages = {};
                    this.groupCapstoneData = {};
                    this.capstoneStudents = [];
                    this.groupTypes = [];
                    this.strats = {};
                    console.log('Facilitator Groups Loaded');
                    this.activate();
                }
                EcInstructorGroups.prototype.activate = function () {
                    this.dCtx.faculty.initializeCourses(false);
                    //.then((retData: ecat.entity.ICrseStudInGroup[]) => {
                    //    //retData = retData.sort(sortCourseMems);
                    //    this.courses = retData;
                    //    this.selectedCourse = this.courses[0].course;
                    //    this.dCtx.faculty.activeCourseId = this.selectedCourse.id;
                    //    console.log(this.courses);
                    //    console.log(this.selectedCourse);
                    //    this.selectedCourse.groups.forEach((grp: any) => {
                    //        var found = this.groupTypes.some(gt => {
                    //            if (gt === grp.mpCategory) { return true; }
                    //        });
                    //        if (!found) { this.groupTypes.push(grp.mpCategory); }
                    //    });
                    //});
                    function sortCourseMems(first, second) {
                        if (first.course.startDate < second.course.startDate) {
                            return 1;
                        }
                        if (first.course.startDate > second.course.startDate) {
                            return -1;
                        }
                        if (first.course.startDate === second.course.startDate) {
                            return 0;
                        }
                    }
                    this.orderBy = '';
                };
                EcInstructorGroups.prototype.changeCourse = function (selectedCourse) {
                    //this.selectedCourse = selectedCourse.courseEnrollment;
                    this.dCtx.faculty.activeCourseId = this.selectedCourse.id;
                };
                EcInstructorGroups.prototype.selectGroup = function (selected, type) {
                    //this.dCtx.faculty.getMemberByGroupId()
                    //    .then((retData: ecat.entity.IFacWorkGroup) => {
                    //        this.selectedGroup = retData;
                    //        this.dCtx.faculty.activeGroupId = this.selectedGroup.id;
                    //        this.setUpView(type);
                    //    });
                };
                EcInstructorGroups.prototype.setUpView = function (type) {
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
                };
                EcInstructorGroups.prototype.massFlagUnflagged = function () {
                    this.selectedGroup.groupMembers.forEach(function (gm) {
                        gm.authorOfComments.forEach(function (aoc) {
                            if (aoc.mpCommentFlagFac === null) {
                                aoc.mpCommentFlagFac = _mp.MpCommentFlag.neut;
                            }
                        });
                    });
                    this.publishStatus.commentsComplete = true;
                };
                EcInstructorGroups.prototype.massFlagReset = function () {
                    this.selectedGroup.groupMembers.forEach(function (gm) {
                        gm.authorOfComments.forEach(function (aoc) {
                            aoc.mpCommentFlagFac = _mp.MpCommentFlag.neut;
                            //aoc.facFlaggedById = this.dCtx.user.persona.personId;
                        });
                    });
                    this.publishStatus.commentsComplete = true;
                };
                EcInstructorGroups.prototype.checkPublish = function () {
                    var _this = this;
                    if (this.selectedGroup.mpSpStatus === _mp.MpSpStatus.open) {
                        this.selectedGroup.mpSpStatus = _mp.MpSpStatus.underReview;
                        this.publishStatus.commentsComplete = false;
                        this.publishStatus.stratsComplete = false;
                    }
                    else if (this.selectedGroup.mpSpStatus === _mp.MpSpStatus.underReview) {
                        this.selectedGroup.groupMembers.forEach(function (gm) {
                            //var unflaggedComments = gm.authorOfComments.some(aoc => {
                            //    if (aoc.mpCommentFlagFac === null || aoc.mpCommentFlagFac === undefined) {
                            //        return true;
                            //    }
                            //});
                            var unflaggedComments = gm.authorOfComments.filter(function (aoc) {
                                if (aoc.mpCommentFlagFac === null) {
                                    return true;
                                }
                                return false;
                            });
                            if (unflaggedComments.length > 0) {
                                _this.publishStatus.commentsComplete = false;
                            }
                        });
                    }
                };
                EcInstructorGroups.prototype.setUpStrats = function () {
                    var _this = this;
                    this.selectedGroup.groupMembers.forEach(function (gm) {
                        _this.dCtx.faculty.getFacStrat(gm.studentId);
                    });
                };
                EcInstructorGroups.prototype.viewDetails = function () {
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
                };
                EcInstructorGroups.prototype.getResultString = function (respScore) {
                    if (respScore < -1) {
                        return 'Ineffective Always';
                    }
                    if (respScore >= -1 && respScore < 0) {
                        return 'Ineffective Usually';
                    }
                    if (respScore >= 0 && respScore < 1) {
                        return 'Not Displayed';
                    }
                    if (respScore >= 1 && respScore < 2) {
                        return 'Effective Usually';
                    }
                    if (respScore >= 2 && respScore < 3) {
                        return 'Effective Always';
                    }
                    if (respScore >= 3 && respScore < 4) {
                        return 'Highly Effective Usually';
                    }
                    if (respScore >= 4) {
                        return 'Highly Effective Always';
                    }
                    //switch (respScore) {
                    //    case :
                    //}
                };
                EcInstructorGroups.prototype.setUpResults = function () {
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
                };
                //savePublish(): void {
                //    var stratsCheck = true;
                //    var stratList: number[] = [];
                //    this.selectedGroup.groupMembers.forEach(gm => {
                //        var found = false;
                //        found = this.selectedGroup.facStratResponses.some(strat => {
                //            if (strat.assesseeId === gm.id) { return true; }
                //        });
                //        if (!found) {
                //            stratsCheck = false;
                //        } else {
                //            if (this.strats[gm.id] !== null || this.strats[gm.id] !== undefined) {
                //                stratList.push(this.strats[gm.id]);
                //            } else {
                //                stratsCheck = false;
                //            }
                //        }
                //    });
                //    if (stratsCheck) {
                //        stratList.sort((first: number, second: number) => {
                //            if (first === second) {
                //                stratsCheck = false;
                //                return 0;
                //            }
                //        });
                //    }
                //    if (stratsCheck) {
                //    }
                //    this.selectedGroup.groupMembers.forEach(gm => {
                //        if (this.strats[gm.id] !== null || this.strats[gm.id] !== undefined) {
                //            var studentStrat = this.selectedGroup.facStratResponses.filter(strat => {
                //                if (strat.assesseeId === gm.id) {
                //                    return true;
                //                }
                //            });
                //            if (studentStrat[0] !== undefined) {
                //            }
                //            studentStrat[0].stratPosition = this.strats[gm.id];
                //        }
                //    });
                //    this.save();
                //}
                EcInstructorGroups.prototype.cancelPublish = function () {
                    var self = this;
                    var cancelAlertSettings = {
                        title: 'Cancel Publication',
                        text: 'Canceling will reopen the group and allow students to make changes. Are you sure you want to cancel?',
                        type: 'warning',
                        confirmButtonText: 'Cancel Publication',
                        closeOnConfirm: true,
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        showCancelButton: true
                    };
                    this.c.swal(cancelAlertSettings, afterCancelPublish);
                    function afterCancelPublish(confirmed) {
                        if (!confirmed) {
                            return;
                        }
                        self.selectedGroup.mpSpStatus = _mp.MpSpStatus.open;
                        self.save();
                    }
                };
                EcInstructorGroups.prototype.publish = function () {
                    this.checkPublish();
                    var self = this;
                    if (this.publishStatus.commentsComplete && this.publishStatus.stratsComplete) {
                        var publishAlertSettings = {
                            title: 'Publish Group',
                            text: 'Publishing is final, you cannot change anything after this is completed. Are you sure you want to publish?',
                            type: 'warning',
                            confirmButtonText: 'Publish',
                            closeOnConfirm: true,
                            allowEscapeKey: true,
                            allowOutsideClick: true,
                            showCancelButton: true
                        };
                        this.c.swal(publishAlertSettings, afterPublishConfirmClose);
                    }
                    else {
                        var incompleteAlertSettings = {
                            title: 'Review Incomplete',
                            text: 'You have not completed the group review,',
                            type: 'error',
                            confirmButtonText: 'Continue Review',
                            closeOnConfirm: true,
                            allowEscapeKey: true,
                            allowOutsideClick: true,
                            showCancelButton: false
                        };
                        if (!this.publishStatus.commentsComplete) {
                            incompleteAlertSettings.text += ' not all comments are flagged';
                        }
                        if (!this.publishStatus.stratsComplete) {
                            if (!this.publishStatus.commentsComplete) {
                                incompleteAlertSettings.text += ' and';
                            }
                            incompleteAlertSettings.text += ' you have not completed all stratifications';
                        }
                        incompleteAlertSettings.text += '.';
                        this.c.swal(incompleteAlertSettings, afterIncompleteConfirmClose);
                    }
                    function afterPublishConfirmClose(confirmed) {
                        if (!confirmed) {
                            return;
                        }
                        self.selectedGroup.mpSpStatus = _mp.MpSpStatus.published;
                        self.save();
                    }
                    function afterIncompleteConfirmClose(confirmed) {
                        if (confirmed) {
                            return;
                        }
                    }
                };
                EcInstructorGroups.prototype.setUpCapstone = function () {
                    var self = this;
                    //this.dCtx.faculty.getCapstoneData()
                    //    .then((retData: any) => gotCapstoneData(retData));
                    function gotCapstoneData(retData) {
                        self.capstoneStudents = retData;
                        self.capstoneStudents.forEach(function (cm) {
                            var studentCapstoneData = {};
                            //cm.studGroupEnrollments.forEach(gm => {
                            //    var groupResults: IStudentGroupResults = {
                            //        strat: 0,
                            //        self: '',
                            //        peer: '',
                            //        fac: ''
                            //    }
                            //    groupResults.strat = gm.stratResults[0].finalStratPosition;
                            //    //groupResults.self = gm.assessResults[0].self;
                            //    //groupResults.peer = gm.assessResults[0].peer;
                            //    //groupResults.fac = gm.assessResults[0].fac;
                            //    studentCapstoneData[gm.group.mpCategory] = groupResults;
                            //});
                            //self.groupCapstoneData[cm.id] = studentCapstoneData;
                        });
                    }
                };
                EcInstructorGroups.prototype.save = function () {
                    var self = this;
                    this.dCtx.faculty.saveChanges()
                        .then(saveReturn)
                        .catch(saveRejected);
                    function saveReturn(ret) {
                    }
                    function saveRejected(reason) {
                        if (reason) {
                        }
                    }
                };
                //#region modal calls
                EcInstructorGroups.prototype.viewStatus = function () {
                    this.uiModal.open(this.statusModalOptions);
                };
                EcInstructorGroups.prototype.viewCapstoneStudentDetails = function (student) {
                    this.selectedStudent = student;
                    //this.dCtx.faculty.selectedStudentCMId = this.selectedStudent.courseEnrollmentId;
                    this.uiModal.open(this.capstoneStudentDetailModalOptions);
                };
                EcInstructorGroups.prototype.addAssessment = function (assessee) {
                    //const self = this;
                    //var spResponses: ecat.entity.IFacSpAssess[] = [];
                    //this.selectedGroup.assignedSpInstr.inventoryCollection.forEach(inv => {
                    //    var newResponse = this.dCtx.faculty.getNewFacSpAssessResponse(this.selectedGroup, assessee, inv);
                    //    spResponses.push(newResponse);
                    //});
                    //this.addModalOptions.resolve = {
                    //    mode: () => 'faculty',
                    //    assessment: () => spResponses
                    //};
                    //this.uiModal.open(this.addModalOptions)
                    //    .result
                    //    .then(retData => assessmentSaved(retData))
                    //    .catch(assessmentError);
                    //function assessmentSaved(retData: ecat.entity.IFacSpAssess[]) {
                    //    retData.forEach(resp => {
                    //        self.selectedGroup.facSpResponses.push(resp);
                    //    });
                    //    self.save();
                    //}
                    //function assessmentError() {
                    //}
                };
                EcInstructorGroups.prototype.editAssessment = function (assessee) {
                    //const self = this;
                    //var spResponses = this.selectedGroup.facSpResponses.filter(resp => {
                    //    if (resp.assesseeId === assessee.id) {
                    //        return true;
                    //    }
                    //    return false;
                    //});
                    //this.editModalOptions.resolve = {
                    //    mode: () => 'faculty',
                    //    assessment: () => spResponses
                    //};
                    //this.uiModal.open(this.editModalOptions)
                    //    .result
                    //    .then(retData => assessmentSaved(retData))
                    //    .catch(assessmentError);
                    //function assessmentSaved(retData: ecat.entity.IFacSpAssess[]) {
                    //    self.save();
                    //}
                    //function assessmentError() {
                    //}
                };
                EcInstructorGroups.prototype.addComment = function (recipient) {
                    //    const self = this;
                    //    var comment = this.dCtx.faculty.getNewFacComment(this.selectedGroup, recipient);
                    //    this.commentModalOptions.resolve = {
                    //        mode: () => 'faculty',
                    //        //comment: () => comment
                    //    };
                    //    this.uiModal.open(this.commentModalOptions)
                    //        .result
                    //        .then(retData => commentSaved(retData))
                    //        .catch(commentError);
                    //    function commentSaved(retData: any) {
                    //        self.selectedGroup.facSpComments.push(retData);
                    //        self.selectedGroup.statusOfStudent[recipient.id].hasComment = true;
                    //        self.save();
                    //    }
                    //    function commentError() {
                    //    }
                };
                EcInstructorGroups.prototype.editComment = function (recipient) {
                    //const self = this;
                    //var comment = this.selectedGroup.facSpComments.filter(com => {
                    //    if (com.recipientId === recipient.id) {
                    //        return true;
                    //    }
                    //    return false;
                    //});
                    //this.commentModalOptions.resolve = {
                    //    mode: () => 'faculty',
                    //    comment: () => comment[0]
                    //};
                    //this.uiModal.open(this.commentModalOptions)
                    //    .result
                    //    .then(retData => commentSaved(retData))
                    //    .catch(commentError);
                    //function commentSaved(retData: any) {
                    //    self.save();
                    //}
                    //function commentError() {
                    //}
                };
                EcInstructorGroups.controllerId = 'app.faculty.features.groups';
                EcInstructorGroups.$inject = ['$uibModal', commonService_1.default.serviceId, context_1.default.serviceId];
                return EcInstructorGroups;
            })();
            exports_1("default", EcInstructorGroups);
        }
    }
});
