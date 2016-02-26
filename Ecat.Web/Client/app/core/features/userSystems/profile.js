System.register(["core/common/commonService", "core/service/data/context", "core/common/mapStrings"], function(exports_1) {
    var commonService_1, context_1, _mp;
    var PageTypeEnum, EcUserProfile;
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
            (function (PageTypeEnum) {
                PageTypeEnum[PageTypeEnum["Main"] = 0] = "Main";
                PageTypeEnum[PageTypeEnum["HqStaff"] = 1] = "HqStaff";
                PageTypeEnum[PageTypeEnum["Facilitator"] = 2] = "Facilitator";
                PageTypeEnum[PageTypeEnum["Student"] = 3] = "Student";
                PageTypeEnum[PageTypeEnum["External"] = 4] = "External";
                PageTypeEnum[PageTypeEnum["Connections"] = 5] = "Connections";
            })(PageTypeEnum || (PageTypeEnum = {}));
            EcUserProfile = (function () {
                function EcUserProfile($scope, c, dCtx) {
                    var _this = this;
                    this.$scope = $scope;
                    this.c = c;
                    this.dCtx = dCtx;
                    this.affiliationList = this.dCtx.static.milAffil;
                    this.componentList = this.dCtx.static.milComponent;
                    this.editing_aboutMeForm = false;
                    this.editing_basicInfoForm = false;
                    this.editing_studentInfoForm = false;
                    this.editing_externalUserForm = false;
                    this.gender = _mp.EcMapGender;
                    this.inflight = false;
                    this.isLtiRole = false;
                    this.isSaving = false;
                    this.logWarning = this.c.logWarning('User Profile');
                    this.logSuccess = this.c.logSuccess('User Profile');
                    this.nonAllowList = {};
                    this.pageTypeEnum = PageTypeEnum;
                    this.page = this.pageTypeEnum.External;
                    this.payGradeList = this.dCtx.static.milPaygradeList;
                    this.payGradeEnum = _mp.EcMapPaygrade;
                    this.showExternal = false;
                    this.showStudent = false;
                    this.showHq = false;
                    this.showFaculty = false;
                    this.userRoles = _mp.EcMapInstituteRole;
                    console.log('Profile Loaded');
                    this.user = dCtx.user.persona;
                    this.getProfile();
                    switch (this.user.mpInstituteRole) {
                        case _mp.EcMapInstituteRole.student || _mp.EcMapInstituteRole.faculty:
                            this.isLtiRole = true;
                            break;
                        default:
                            this.isLtiRole = false;
                            this.page = PageTypeEnum.Connections;
                            break;
                    }
                    this.$scope.$on('$stateChangeStart', function (event, toState) {
                        var parentName = toState.parent;
                        if (!_this.user.registrationComplete && parentName !== c.stateMgr.core.redirect.name) {
                            event.preventDefault();
                            c.swal('Registration Error', 'You muse complete your profile, before using the app', 'error');
                        }
                    });
                    this.$scope.$on(c.coreCfg.coreApp.events.saveChangesEvent, function (event, data) {
                        _this.inflight = data[0].inflight;
                    });
                }
                EcUserProfile.prototype.cancelFormEdit = function (formName) {
                    var _this = this;
                    if (!this[formName]['$dirty']) {
                        this[("editing_" + formName)] = false;
                        return null;
                    }
                    var settings = {
                        title: 'Wait a minute...'
                    };
                    settings.text = 'You have unsaved changes,  are you sure you would like to disregard all changes?';
                    settings.allowEscapeKey = false;
                    settings.type = 'warning';
                    settings.showCancelButton = true;
                    settings.confirmButtonColor = '#f44336';
                    settings.confirmButtonText = 'Yes-Abort Changes';
                    settings.closeOnCancel = false;
                    settings.closeOnConfirm = false;
                    swal(settings, function (confirmed) {
                        if (confirmed) {
                            _this.user.entityAspect.rejectChanges();
                            var activeForm = _this[formName];
                            activeForm.$setPristine();
                            _this[("editing_" + formName)] = false;
                            _this.c.swal('Done!', 'Just like new again', 'success');
                            if (_this.showStudent) {
                                _this.user.student.entityAspect.rejectChanges();
                            }
                            if (_this.showFaculty) {
                                _this.user.faculty.entityAspect.rejectChanges();
                            }
                            if (_this.showExternal) {
                                _this.user.external.entityAspect.rejectChanges();
                            }
                        }
                        else {
                            swal.close();
                        }
                    });
                };
                EcUserProfile.prototype.saveForm = function (formName) {
                    var _this = this;
                    if (formName === 'aboutMeForm') {
                        switch (this.user.mpInstituteRole) {
                            case _mp.EcMapInstituteRole.student:
                                this.user.student.bio = this.aboutMeText;
                                break;
                            case _mp.EcMapInstituteRole.faculty:
                                this.user.faculty.bio = this.aboutMeText;
                                break;
                            case _mp.EcMapInstituteRole.external:
                                this.user.external.bio = this.aboutMeText;
                                break;
                            default:
                                break;
                        }
                    }
                    if (this[formName]['$valid']) {
                        this.dCtx.user.saveUserChanges()
                            .then(function () {
                            _this.logSuccess('Your changes were successfully saved!', null, true);
                            _this[("editing_" + formName)] = false;
                        })
                            .catch(function () {
                            _this.logWarning('Unable to save changes, Please try again later!', null, false);
                        });
                    }
                };
                EcUserProfile.prototype.updatePayGradeList = function () {
                    var userWPaygrade = this.dCtx.static.updatePayGradeList(this.user);
                    if (userWPaygrade) {
                        this.user = userWPaygrade.user;
                        this.payGradeList = userWPaygrade.paygradelist;
                    }
                };
                EcUserProfile.prototype.getProfile = function () {
                    var self = this;
                    this.dCtx.user.getUserProfile()
                        .then(getProfileResponse)
                        .catch(getProfileError);
                    function getProfileResponse() {
                        self.showStudent = !!self.user.student;
                        self.showFaculty = !!self.user.faculty;
                        self.showExternal = !!self.user.external;
                        self.showHq = !!self.user.hqStaff;
                        //self.aboutMeText = self.user.profile.bio;
                    }
                    function getProfileError(error) {
                        console.log(error);
                    }
                };
                EcUserProfile.controllerId = 'app.user.profile';
                EcUserProfile.$inject = ['$scope', commonService_1.default.serviceId, context_1.default.serviceId];
                return EcUserProfile;
            })();
            exports_1("default", EcUserProfile);
        }
    }
});
