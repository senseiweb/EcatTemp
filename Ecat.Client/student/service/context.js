System.register(['core/service/data/utility', "core/entityExtension/crseStudentInGroup", "core/entityExtension/person", "core/common/mapStrings"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var utility_1, _crseStudGroup, _personExt, _mp;
    var EcStudentRepo;
    return {
        setters:[
            function (utility_1_1) {
                utility_1 = utility_1_1;
            },
            function (_crseStudGroup_1) {
                _crseStudGroup = _crseStudGroup_1;
            },
            function (_personExt_1) {
                _personExt = _personExt_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcStudentRepo = (function (_super) {
                __extends(EcStudentRepo, _super);
                function EcStudentRepo(inj) {
                    _super.call(this, inj, 'Student Data Service', _mp.EcMapApiResource.student, [_personExt.personConfig, _crseStudGroup.memberInGrpEntityExt]);
                    this.activated = false;
                    this.studentApiResources = {
                        courses: {
                            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
                            resource: 'InitCourse'
                        },
                        course: {
                            returnedEntityType: _mp.EcMapEntityType.studCrseMember,
                            resource: 'ActiveCourse'
                        },
                        workGroup: {
                            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
                            resource: 'ActiveWorkGroup'
                        }
                    };
                    this.loadManager(this.studentApiResources);
                    this.isLoaded.course = {};
                    this.isLoaded.workGroup = {};
                    this.isLoaded.crseInStudGroup = {};
                }
                EcStudentRepo.prototype.initCrseStudGroup = function (forceRefresh) {
                    var api = this.studentApiResources;
                    var isLoaded = this.isLoaded;
                    var log = this.log;
                    var orderBy = 'course.startDate desc';
                    if (isLoaded.courses && !forceRefresh) {
                        var courseMems = this.queryLocal(api.courses.resource, orderBy);
                        this.logSuccess('Courses loaded from local cache', courseMems, false);
                        return this.c.$q.when(courseMems);
                    }
                    return this.query.from(api.courses.resource)
                        .using(this.manager)
                        .orderBy(orderBy)
                        .execute()
                        .then(initCoursesReponse)
                        .catch(this.queryFailed);
                    function initCoursesReponse(data) {
                        var crseStudInGroups = data.results;
                        isLoaded.courses = crseStudInGroups.length > 0;
                        crseStudInGroups.forEach(function (crseStudInGroup) {
                            isLoaded.crseInStudGroup[crseStudInGroup.entityId] = true;
                            if (crseStudInGroup.course) {
                                isLoaded[crseStudInGroup.courseId] = true;
                            }
                            if (crseStudInGroup.workGroup && crseStudInGroup.workGroup.groupMembers.length > 1) {
                                isLoaded.workGroup[crseStudInGroup.workgroupId] = true;
                                crseStudInGroup.getMigStatus();
                            }
                        });
                        log.success('Courses loaded from remote store', data, false);
                        return crseStudInGroups;
                    }
                };
                /**
                 * @desc  Gets the active course membership with course and group membership for the latest join workgroup, i.e. BC4.
                 */
                EcStudentRepo.prototype.getActiveCourse = function () {
                    var _this = this;
                    if (!this.activeCourseId) {
                        this.c.$q.reject(function () {
                            _this.logWarn('Not active course selected!', null, false);
                            return 'A course must be selected';
                        });
                    }
                    var course;
                    var _common = this.c;
                    var log = this.log;
                    var api = this.studentApiResources;
                    var pred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);
                    var isLoaded = this.isLoaded;
                    if (isLoaded.course[this.activeCourseId]) {
                        var studInCourse = this.queryLocal(api.course.resource, null, pred);
                        course = studInCourse.course;
                        log.success('Course loaded from local cache', course, false);
                        return this.c.$q.when(course);
                    }
                    return this.query.from(api.course.resource)
                        .using(this.manager)
                        .where(pred)
                        .execute()
                        .then(getActiveCrseReponse)
                        .catch(this.queryFailed);
                    function getActiveCrseReponse(data) {
                        var studInCrse = data.results[0];
                        if (!studInCrse) {
                            return _common.$q.reject(function () { return log.warn('Query succeeded, but the course membership did not return a result', data, false); });
                        }
                        course = studInCrse.course;
                        isLoaded.course[course.id] = true;
                        if (course.workGroups) {
                            var groups = course.workGroups;
                            groups.forEach(function (grp) {
                                isLoaded.workGroup[grp.id] = true;
                            });
                        }
                        if (course.studentInCrseGroups && course.studentInCrseGroups.length > 1) {
                            var crseStudInGroups = course.studentInCrseGroups;
                            crseStudInGroups.forEach(function (stud) {
                                isLoaded.crseInStudGroup[stud.entityId] = true;
                            });
                        }
                        return course;
                    }
                };
                EcStudentRepo.prototype.getActivetWorkGroup = function () {
                    var _this = this;
                    if (!this.activeGroupId || !this.activeCourseId) {
                        this.c.$q.reject(function () {
                            _this.logWarn('Not active course/workgroup selected!', null, false);
                            return 'A course/workgroup must be selected';
                        });
                    }
                    var workGroup;
                    var _common = this.c;
                    var log = this.log;
                    var api = this.studentApiResources;
                    var groupPred = new breeze.Predicate('workgroupId', breeze.FilterQueryOp.Equals, this.activeGroupId);
                    var coursePred = new breeze.Predicate('courseId', breeze.FilterQueryOp.Equals, this.activeCourseId);
                    var predKey = breeze.Predicate.and([coursePred, groupPred]);
                    var isLoaded = this.isLoaded;
                    if (isLoaded.workGroup[this.activeGroupId]) {
                        var studInGroup = this.queryLocal(api.workGroup.resource, null, predKey);
                        workGroup = studInGroup[0].workGroup;
                        log.success('Workgroup loaded from local cache', studInGroup, false);
                        return this.c.$q.when(workGroup);
                    }
                    return this.query.from(api.workGroup.resource)
                        .using(this.manager)
                        .where(predKey)
                        .execute()
                        .then(getActiveWorkGrpResponse)
                        .catch(this.queryFailed);
                    function getActiveWorkGrpResponse(data) {
                        var studInGroup = data.results[0];
                        workGroup = studInGroup.workGroup;
                        if (!workGroup) {
                            return _common.$q.reject(function () { return log.warn('Query succeeded, but the course membership did not return a result', data, false); });
                        }
                        isLoaded.workGroup[workGroup.id] = true;
                        if (workGroup.groupMembers) {
                            var members = workGroup.groupMembers;
                            members.forEach(function (member) {
                                isLoaded.workGroup[member.entityId] = true;
                            });
                        }
                        return workGroup;
                    }
                };
                EcStudentRepo.prototype.getNewSpAssessResponse = function (assessor, assessee, inventory) {
                    var newAssessResponse = {
                        assessor: assessor,
                        assessee: assessee,
                        inventoryItem: inventory
                    };
                    return this.manager.createEntity(_mp.EcMapEntityType.spResponse, newAssessResponse);
                };
                EcStudentRepo.prototype.getOrAddComment = function (recipientId) {
                    var _this = this;
                    var loggedUserId = this.dCtx.user.persona.personId;
                    if (!this.activeGroupId || !this.activeCourseId) {
                        this.logWarn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
                    }
                    var spComments = this.manager.getEntities(_mp.EcMapEntityType.spComment);
                    var spComment = spComments.filter(function (comment) { return comment.authorPersonId === loggedUserId &&
                        comment.recipientPersonId === recipientId &&
                        comment.courseId === _this.activeCourseId &&
                        comment.workGroupId === _this.activeGroupId; })[0];
                    if (spComment) {
                        return spComment;
                    }
                    var newComment = {
                        authorPersonId: loggedUserId,
                        recipientPersonId: recipientId,
                        courseId: this.activeCourseId,
                        workGroupId: this.activeGroupId,
                        commentVersion: 0,
                        mpCommentFlagAuthor: _mp.MpCommentFlag.neut,
                    };
                    return this.manager.createEntity(_mp.EcMapEntityType.spComment, newComment);
                };
                EcStudentRepo.serviceId = 'data.student';
                EcStudentRepo.$inject = ['$injector'];
                return EcStudentRepo;
            })(utility_1.default);
            exports_1("default", EcStudentRepo);
        }
    }
});
