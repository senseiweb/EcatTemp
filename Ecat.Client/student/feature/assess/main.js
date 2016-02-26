System.register(["core/common/commonService", 'core/service/data/context', "core/common/mapStrings"], function(exports_1) {
    var commonService_1, context_1, _mp;
    var EcStudentAssessments;
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
            //import {EcMapGender as gender} from "appVars"
            EcStudentAssessments = (function () {
                function EcStudentAssessments(uiModal, c, dCtx) {
                    this.uiModal = uiModal;
                    this.c = c;
                    this.dCtx = dCtx;
                    this.appVar = _mp;
                    this.hasComment = false;
                    this.isResultPublished = false;
                    this.fullName = 'Unknown';
                    this.groupMembers = [];
                    //Turns logError into a log error function that is displayed to the client. 
                    this.logError = this.c.logSuccess('Assessment Center');
                    this.courseEnrollments = [];
                    this.groups = [];
                    console.log('Assessment Loaded');
                    this.activate();
                }
                EcStudentAssessments.prototype.activate = function () {
                    this.user = this.dCtx.user.persona;
                    this.fullName = this.user.firstName + " " + this.user.lastName + "'s";
                    var self = this;
                    function courseError(error) {
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
                    function sortByDate(first, second) {
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
                };
                EcStudentAssessments.prototype.isolateSelf = function () {
                    var _this = this;
                    this.peers = this.activeGroupMember.groupPeers.filter(function (peer) {
                        if (peer.studentId === _this.activeGroupMember.studentId) {
                            _this.studentSelf = peer;
                            return false;
                        }
                        return true;
                    });
                };
                EcStudentAssessments.prototype.checkIfPublished = function () {
                    if (this.activeGroupMember.group.mpSpStatus === _mp.MpSpStatus.published) {
                        this.isResultPublished = true;
                    }
                };
                EcStudentAssessments.prototype.sortByCategory = function (first, second) {
                    if (first.group.mpSpStatus === _mp.MpSpStatus.published) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                };
                EcStudentAssessments.prototype.setActiveCourse = function (courseMember) {
                    this.activeCourseMember = courseMember;
                    this.groups = this.activeCourseMember.workGroupEnrollments;
                    this.groups = this.groups.sort(this.sortByCategory);
                    this.activeGroupMember = this.groups[0];
                    this.isolateSelf();
                };
                EcStudentAssessments.prototype.setActiveGroup = function (groupMember) {
                    this.activeGroupMember = groupMember;
                    this.isolateSelf();
                };
                EcStudentAssessments.prototype.addAssessment = function (assessee) {
                    var spResponses = [];
                    var mode;
                    this.activeGroupMember.group.assignedSpInstr.inventoryCollection.forEach(function (inv) {
                        //var newResponse = this.dCtx.student.getNewSpAssessResponse(this.activeGroupMember, assessee, inv);
                        //spResponses.push(newResponse);
                    });
                    if (assessee.studentId === this.studentSelf.studentId) {
                        mode = 'self';
                    }
                    else {
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
                };
                EcStudentAssessments.prototype.addComment = function (recipientId) {
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
                };
                EcStudentAssessments.prototype.editAssessment = function (assessee) {
                    var mode;
                    if (assessee.studentId === this.studentSelf.studentId) {
                        mode = 'self';
                    }
                    else {
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
                };
                EcStudentAssessments.controllerId = 'app.student.assessment';
                EcStudentAssessments.$inject = ['$uibModal', commonService_1.default.serviceId, context_1.default.serviceId];
                return EcStudentAssessments;
            })();
            exports_1("default", EcStudentAssessments);
        }
    }
});
