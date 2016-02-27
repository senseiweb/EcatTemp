System.register(['core/service/data/utility', "core/entityExtension/crseStudentInGroup", "core/common/mapStrings"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var utility_1, _crseStudGroup, _mp;
    var EcStudentRepo;
    return {
        setters:[
            function (utility_1_1) {
                utility_1 = utility_1_1;
            },
            function (_crseStudGroup_1) {
                _crseStudGroup = _crseStudGroup_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcStudentRepo = (function (_super) {
                __extends(EcStudentRepo, _super);
                function EcStudentRepo(inj) {
                    _super.call(this, inj, 'Student Data Service', _mp.EcMapApiResource.student, [_crseStudGroup.memberInGrpEntityExt]);
                    this.activated = false;
                    this.studentApiResources = {
                        initCourses: {
                            returnedEntityType: _mp.EcMapEntityType.grpMember,
                            resource: {
                                name: 'GetInitalCourses',
                                isLoaded: false
                            }
                        },
                        getCourseGroupMembers: {
                            returnedEntityType: _mp.EcMapEntityType.studCrseMember,
                            resource: {
                                name: 'GetCrseGrpMembers',
                                isLoaded: {
                                    course: {}
                                }
                            }
                        },
                        getGroupMembers: {
                            returnedEntityType: _mp.EcMapEntityType.grpMember,
                            resource: {
                                name: 'GetGrpMember',
                                isLoaded: {
                                    group: {}
                                }
                            }
                        }
                    };
                    this.loadManager(this.studentApiResources);
                }
                EcStudentRepo.prototype.initCourses = function (forceRefresh) {
                    var api = this.studentApiResources;
                    var self = this;
                    if (api.initCourses.resource.isLoaded && !forceRefresh) {
                        var courseMems = this.queryLocal(api.initCourses.resource.name);
                        this.logSuccess('Courses loaded from local cache', courseMems, false);
                        return this.c.$q.when(courseMems);
                    }
                    return this.query.from(api.initCourses.resource.name)
                        .using(this.manager)
                        .orderBy('course.startDate desc')
                        .execute()
                        .then(initCoursesReponse)
                        .catch(this.queryFailed);
                    function initCoursesReponse(data) {
                        var studCourse = data.results;
                        studCourse.forEach(function (studCrse) {
                            if (studCrse.workGroupEnrollments) {
                                studCrse.workGroupEnrollments.forEach(function (grp) {
                                    api.getCourseGroupMembers.resource.isLoaded[grp.entityId] = true;
                                    grp.getMigStatus();
                                    console.log(grp.statusOfPeer);
                                });
                                api.getCourseGroupMembers.resource.isLoaded[studCrse.entityId] = true;
                            }
                        });
                        self.logSuccess('Courses loaded from remote store', studCourse, false);
                        return studCourse;
                    }
                };
                /**
                 * @desc  Gets the active course membership with course and group membership for the latest join workgroup, i.e. BC4.
                 */
                EcStudentRepo.prototype.getCourseGroupMembers = function () {
                    var _this = this;
                    if (!this.activeCourseId) {
                        this.c.$q.reject(function () {
                            _this.logWarn('Not active course selected!', null, false);
                            return 'A course must be selected';
                        });
                    }
                    var self = this;
                    var crseMem = null;
                    var api = this.studentApiResources;
                    var isLoaded = api.getCourseGroupMembers.resource.isLoaded.course;
                    if (isLoaded[this.activeCourseId]) {
                        var pred = new breeze.Predicate('id', breeze.FilterQueryOp.Equals, this.activeCourseId);
                        crseMem = this.queryLocal(api.getCourseGroupMembers.resource.name, null, pred);
                        this.logSuccess('Course loaded from local cache', crseMem, false);
                        return this.c.$q.when(crseMem);
                    }
                    return this.query.from(api.getCourseGroupMembers.resource.name)
                        .using(this.manager)
                        .withParameters({ crseMemId: this.activeCourseId })
                        .execute()
                        .then(getCoursesResponse)
                        .catch(this.queryFailed);
                    function getCoursesResponse(data) {
                        crseMem = data.results[0];
                        if (!crseMem) {
                            return self.c.$q.reject(function () { return self.logWarn('Query succeeded, but the course membership did not return a result', data, false); });
                        }
                        //if (crseMem.courseEnrollmen) {
                        //    const grpLoaded = api.getGroupMembers.resource.isLoaded.group;
                        //    crseMem.studGroupEnrollments.forEach(grpMem => {
                        //        grpLoaded[grpMem.id] = true;
                        //    });
                        //}
                        return crseMem;
                    }
                };
                EcStudentRepo.prototype.getGroupMembers = function () {
                    var _this = this;
                    if (!this.activeGroupId) {
                        this.c.$q.reject(function () {
                            _this.logWarn('Not active course selected!', null, false);
                            return 'A course must be selected';
                        });
                    }
                    var self = this;
                    var grpMem = null;
                    var api = this.studentApiResources;
                    var isLoaded = api.getGroupMembers.resource.isLoaded.group;
                    if (isLoaded[this.activeGroupId]) {
                        var pred = new breeze.Predicate('id', breeze.FilterQueryOp.Equals, this.activeGroupId);
                        grpMem = this.queryLocal(api.getGroupMembers.resource.name, null, pred);
                        this.logSuccess('Course loaded from local cache', grpMem, false);
                        return this.c.$q.when(grpMem);
                    }
                    return this.query.from(api.getGroupMembers.resource.name)
                        .using(this.manager)
                        .withParameters({ grpMemId: this.activeGroupId })
                        .execute()
                        .then(getGrpMembersResponse)
                        .catch(this.queryFailed);
                    function getGrpMembersResponse(data) {
                        grpMem = data.results[0];
                        if (!grpMem) {
                            return self.c.$q.reject(function () { return self.logWarn('Query succeeded, but the group membership did not return a result', data, false); });
                        }
                        return grpMem;
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
                        authoerPersonId: loggedUserId,
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
