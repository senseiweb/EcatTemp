System.register(['core/service/data/utility', "core/common/mapStrings", "faculty/entityExtensions/workgroup"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var utility_1, _mp, IFacWorkGrpExt;
    var EcFacultyRepo;
    return {
        setters:[
            function (utility_1_1) {
                utility_1 = utility_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            },
            function (IFacWorkGrpExt_1) {
                IFacWorkGrpExt = IFacWorkGrpExt_1;
            }],
        execute: function() {
            EcFacultyRepo = (function (_super) {
                __extends(EcFacultyRepo, _super);
                function EcFacultyRepo(inj) {
                    _super.call(this, inj, 'Facilitator Data Service', _mp.EcMapApiResource.faculty, [IFacWorkGrpExt.facWorkGrpEntityExt]);
                    this.facilitatorApiResources = {
                        initCourses: {
                            returnedEntityType: _mp.EcMapEntityType.faccultyCrseMember,
                            resource: 'GetInitalCourses'
                        },
                        getGroupById: {
                            returnedEntityType: _mp.EcMapEntityType.workGroup,
                            resource: 'GetWorkGroupData'
                        },
                        getGroupCapstoneData: {
                            returnedEntityType: _mp.EcMapEntityType.faccultyCrseMember,
                            resource: 'GetGroupCapstoneData'
                        },
                        getStudentCapstoneDetails: {
                            returnedEntityType: _mp.EcMapEntityType.crseStudInGrp,
                            resource: 'GetStudentCapstoneDetails'
                        }
                    };
                    this.loadManager(this.facilitatorApiResources);
                }
                EcFacultyRepo.prototype.initializeCourses = function (forceRefresh) {
                    var api = this.facilitatorApiResources;
                    var self = this;
                    if (this.isLoaded && !forceRefresh) {
                        var courseMems = this.queryLocal(api.initCourses.resource);
                        this.log.success('Courses loaded from local cache', courseMems, false);
                        return this.c.$q.when(courseMems);
                    }
                    return this.query.from(api.initCourses.resource)
                        .using(this.manager)
                        .execute()
                        .then(initCoursesReponse)
                        .catch(this.queryFailed);
                    function initCoursesReponse(data) {
                        var crseMems = data.results;
                        crseMems.forEach(function (crseMem) {
                            //if () {
                            // .forEach(grp => {
                            //api.getCourseGroupMembers.resource.isLoaded[grp.id] = true;
                            //   });
                            //api.getCourseGroupMembers.resource.isLoaded[crseMem.courseId] = true;
                            // }
                        });
                        self.log.success('Courses loaded from remote store', crseMems, false);
                        return crseMems;
                    }
                };
                EcFacultyRepo.prototype.getFacSpInventory = function (assesseeId) {
                    var _this = this;
                    if (!this.activeGroupId || !this.activeCourseId) {
                        this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
                    }
                    var instrument = this.manager.getEntityByKey(_mp.EcMapEntityType.spInventory, { courseId: this.activeCourseId, workGroupId: this.activeGroupId });
                    if (!instrument || !instrument.inventoryCollection) {
                        this.log.warn('The instrument and/or inventory is not loaded on client', null, false);
                    }
                    return instrument.inventoryCollection.map(function (inventory) {
                        var key = { assesseePersonId: assesseeId, courseId: _this.activeCourseId, workGroupId: _this.activeGroupId, inventoryItemId: inventory.id };
                        var facSpReponse = _this.manager.getEntityByKey(_mp.EcMapEntityType.facSpResponse, key);
                        if (!facSpReponse) {
                            facSpReponse = _this.manager.createEntity(_mp.EcMapEntityType.facSpResponse, key);
                        }
                        inventory.responseForAssessee = facSpReponse;
                        return inventory;
                    });
                };
                EcFacultyRepo.prototype.getFacSpComment = function (assesseeId) {
                    var _this = this;
                    if (!this.activeGroupId || !this.activeCourseId) {
                        this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
                    }
                    var facComments = this.manager.getEntities(_mp.EcMapEntityType.facSpComment);
                    //Faculty comments are not tied to person, so do not search for faculty id when looking for faculty comments!
                    var facComment = facComments.filter(function (comment) { return comment.studentPersonId === assesseeId && comment.courseId === _this.activeCourseId && comment.workGroupId === _this.activeGroupId; })[0];
                    if (!facComment) {
                        facComment = this.manager.createEntity(_mp.EcMapEntityType.facSpComment, { recipientPersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId });
                    }
                    return facComment;
                };
                EcFacultyRepo.prototype.getFacStrat = function (assesseeId) {
                    if (!this.activeGroupId || !this.activeCourseId) {
                        this.log.warn('Missing required information', { groupdId: this.activeCourseId, courseId: this.activeCourseId }, false);
                    }
                    var key = { assesseePersonId: assesseeId, courseId: this.activeCourseId, workGroupId: this.activeGroupId };
                    var facStrat = this.manager.getEntityByKey(_mp.EcMapEntityType.facStratResponse, key);
                    if (!facStrat) {
                        facStrat = this.manager.createEntity(_mp.EcMapEntityType.facSpComment, key);
                    }
                    return facStrat;
                };
                EcFacultyRepo.serviceId = 'data.faulty';
                EcFacultyRepo.$inject = ['$injector'];
                return EcFacultyRepo;
            })(utility_1.default);
            exports_1("default", EcFacultyRepo);
        }
    }
});
