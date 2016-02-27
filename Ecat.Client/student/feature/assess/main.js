System.register(["core/common/commonService", 'core/service/data/context', "provider/spTools/spTool", "core/common/mapStrings"], function(exports_1) {
    var commonService_1, context_1, spTool_1, _mp;
    var EcStudentAssessments;
    return {
        setters:[
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (spTool_1_1) {
                spTool_1 = spTool_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            //import {EcMapGender as gender} from "appVars"
            EcStudentAssessments = (function () {
                //#endregion
                function EcStudentAssessments(uiModal, c, dCtx, spTools) {
                    this.uiModal = uiModal;
                    this.c = c;
                    this.dCtx = dCtx;
                    this.spTools = spTools;
                    this.fullName = 'Unknown';
                    this.grpDisplayName = 'Not Set';
                    this.hasComment = false;
                    this.isResultPublished = false;
                    this.log = this.c.getAllLoggers('Assessment Center');
                    this.mp = _mp;
                    console.log('Assessment Loaded');
                    this.activate();
                }
                EcStudentAssessments.prototype.activate = function () {
                    var _this = this;
                    this.user = this.dCtx.user.persona;
                    this.fullName = this.user.firstName + " " + this.user.lastName + "'s";
                    var self = this;
                    function courseError(error) {
                        self.log.warn('There was an error loading Courses', error, true);
                    }
                    //This unwraps the promise and retrieves the objects inside and stores it into a local variable
                    //TODO: Whatif there are no courses??
                    this.dCtx.student.initCrseStudGroup(false)
                        .then(function (crseStudInGrp) {
                        _this.courses = _this.getUniqueCourses(crseStudInGrp);
                        _this.workGroups = _this.courses[0].workGroups;
                        _this.activeCrseId = _this.dCtx.student.activeCourseId = _this.courses[0].id;
                        _this.setActiveGroup(_this.workGroups[0]);
                        //this.courseEnrollments = init;
                        //this.activeCourseMember = this.courseEnrollments[0];
                        //this.dCtx.student.activeCourseId = this.activeCourseMember.courseId;
                        //this.groups = this.activeCourseMember.studGroupEnrollments;
                        //this.groups = this.groups.sort(self.sortByCategory);
                        //this.activeGroupMember = this.groups[0];
                        //self.checkIfPublished();
                        //self.isolateSelf();
                    })
                        .catch(courseError);
                    this.stratInputVis = false;
                };
                EcStudentAssessments.prototype.addComment = function (recipientId) {
                    if (!recipientId) {
                        console.log('You must pass a recipient id to use this feature');
                        return null;
                    }
                    //TODO: Add action after the comment has been dealt with
                    this.spTools.loadSpComment(recipientId)
                        .then(function () {
                        console.log('Comment modal closed');
                    })
                        .catch(function () {
                        console.log('Comment model errored');
                    });
                };
                //checkIfPublished(): void {
                //    if (this.activeGroupMember.group.mpSpStatus === _mp.MpSpStatus.published) {
                //        this.isResultPublished = true;
                //    }
                //}
                EcStudentAssessments.prototype.setActiveCourse = function (course) {
                    var _this = this;
                    this.activeCrseId = this.dCtx.student.activeCourseId = course.id;
                    this.dCtx.student.getActiveCourse()
                        .then(function (crse) {
                        var wrkGrp = crse.workGroups[0];
                        _this.setActiveGroup(wrkGrp);
                    })
                        .catch(function () { });
                };
                EcStudentAssessments.prototype.setActiveGroup = function (workGroup) {
                    var _this = this;
                    this.dCtx.student.activeGroupId = workGroup.id;
                    this.grpDisplayName = workGroup.mpCategory + " - " + workGroup.defaultName;
                    var myId = this.dCtx.user.persona.personId;
                    //TODO: Need to do something with the error
                    this.dCtx.student.getActivetWorkGroup()
                        .then(function (wrkGrp) {
                        var grpMembers = wrkGrp.groupMembers;
                        if (grpMembers === null || grpMembers.length === 0) {
                            //TODO: Address a condition if no members are in the group
                            return null;
                        }
                        _this.me = grpMembers.filter(function (gm) { return gm.studentId === myId; })[0];
                        _this.peers = grpMembers.filter(function (gm) { return gm.studentId !== myId; });
                    })
                        .catch(function () { return null; });
                };
                EcStudentAssessments.prototype.getUniqueCourses = function (crseStudInGrp) {
                    var uniqueCourses = {};
                    var courses = [];
                    crseStudInGrp.forEach(function (crseStud) {
                        uniqueCourses[crseStud.courseId] = crseStud.course;
                    });
                    for (var course in uniqueCourses) {
                        if (uniqueCourses.hasOwnProperty(course)) {
                            courses.push(uniqueCourses[course]);
                        }
                    }
                    return courses;
                };
                EcStudentAssessments.controllerId = 'app.student.assessment';
                EcStudentAssessments.$inject = ['$uibModal', commonService_1.default.serviceId, context_1.default.serviceId, spTool_1.default.serviceId];
                return EcStudentAssessments;
            })();
            exports_1("default", EcStudentAssessments);
        }
    }
});
