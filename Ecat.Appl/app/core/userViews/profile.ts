﻿import IDataCtx from 'core/service/data/context'
import ICommon from 'core/service/common'
import ILocal from 'core/service/data/local'
import IDialog from 'core/service/dialog'
import IStateMgr from "core/provider/ecStateProvider"
import * as AppVar from 'appVars'

enum PageTypeEnum {
    Facilitator,
    Student,
    External,
    Connections
}

export default class EcUserProfile {
    static controllerId = 'app.user.profile';
    static $inject = ['$scope',ICommon.serviceId, IDataCtx.serivceId, ILocal.serviceId, IDialog.serviceId, IStateMgr.providerId]; 

    aboutMeText: string;
    aboutMeForm: angular.IFormController;
    basicInfoForm: angular.IFormController;
    editing_aboutMeForm = false;
    editing_basicInfoForm = false;
    editing_studentInfoForm = false;
    gender = AppVar.EcMapGender;
    inflight = false;
    isLtiRole = false;
    isSaving = false;
    logWarning = this.common.logger.getLogFn(EcUserProfile.controllerId, AppVar.EcMapAlertType.warning);
    logSuccess = this.common.logger.getLogFn(EcUserProfile.controllerId, AppVar.EcMapAlertType.success);
    nonAllowList = {};
    pageTypeEnum = PageTypeEnum;
    page = this.pageTypeEnum.External;
    payGradeList: Array<{ pg: string, displayName: string }> = [];
    showExternal = false;
    showStudent = false;
    showFacilitator = false;
    studentInfoForm: angular.IFormController;
    user: ecat.entity.IPerson;
    userRoles = AppVar.EcMapInstituteRole;

    constructor($scope: angular.IScope, private common: ICommon, private dataCtx: IDataCtx, private local: ILocal, private dialog: IDialog, private stateMgr: IStateMgr) {
        console.log('Profile Loaded');
        this.user = dataCtx.user.persona;

        this.getProfile();

        switch (this.user.mpInstituteRole) {
            case AppVar.EcMapInstituteRole.student:
                this.isLtiRole = true;
                this.showStudent = true;
                this.page = PageTypeEnum.Student;
                break;
            case AppVar.EcMapInstituteRole.facilitator:
                this.isLtiRole = true;
                this.showFacilitator = true;
                this.page = PageTypeEnum.Facilitator;
                break;
            case AppVar.EcMapInstituteRole.external:
                this.isLtiRole = false;
                this.showExternal = true;
                this.page = PageTypeEnum.External;
                break;
            default:
                this.isLtiRole = false;
                this.page = PageTypeEnum.Connections;
                break;
        }

        $scope.$on('$stateChangeStart', (event, toState: angular.ui.IState) => {
            const parent = toState.parent as angular.ui.IState;

            if (!this.user.isRegistrationComplete && parent.name === stateMgr.global.redirect.name ) {
                event.preventDefault();
                dialog.swal('Registration Error', 'You muse complete your profile, before using the app', 'error');
            }
        });
        $scope.$on(common.coreCfg.globalEvent.saveChangesEvent, (data: any) => {
            if (!this.user.isRegistrationComplete) {
                this.inflight = data.inflight;
            }
        });
    }

    cancelFormEdit(formName: string): void {
        if (!this[formName]['$dirty']) {
            this[`editing_${formName}`] = false;
            return null;
        }

        this.dialog.warningConfirmAlert('Wait a minute...', 'You have unsaved changes,  are you sure you would like to disregard all changes?', 'Yes-Abort Changes')
            .then(() => {
                this.user.entityAspect.rejectChanges();
                this[formName]['$setPristine()'];
                this[`editing_${formName}`] = false;
                this.dialog.swal('Done!', 'Just like new again', 'success');

                if (this.showStudent) {
                    this.user.student.entityAspect.rejectChanges();
                }

                if (this.showFacilitator) {
                    this.user.facilitator.entityAspect.rejectChanges();
                }

            });
        return null;
    }

    saveForm(formName: string) {

        if (formName === 'aboutMeForm') {
            switch (this.user.mpInstituteRole) {
                case AppVar.EcMapInstituteRole.student:
                    this.user.student.bio = this.aboutMeText;
                    break;
                case AppVar.EcMapInstituteRole.facilitator:
                    this.user.facilitator.bio = this.aboutMeText;
                    break;
                case AppVar.EcMapInstituteRole.external:
                    this.user.external.bio = this.aboutMeText;
                    break;
                default:
                    break;
            }
        }
   
        if (this[formName]['$valid']) {
            this.dataCtx.user.saveUserChanges()
                .then(() => {
                    this.logSuccess('Your changes were successfully saved!', null, true);
                    this[`editing_${formName}`] = false;
                })
                .catch(() => {
                    this.logWarning('Unable to save changes, Please try again later!', null, false);
                });
        }
    }

    updatePayGradeList() {
        return this.local.updatePayGradeList(this.user);
    }

    private getProfile(): void {
        const self = this;
        this.dataCtx.user.getUserProfile()
            .then(getProfileResponse)
            .catch(getProfileError);

        function getProfileResponse(profile: any) {
            let userType = '';
            switch (self.user.mpInstituteRole) {
                case AppVar.EcMapInstituteRole.student:
                    userType = 'student';
                    break;
                case AppVar.EcMapInstituteRole.facilitator:
                    userType = 'facilitator';
                    break;
                case AppVar.EcMapInstituteRole.external:
                    userType = 'external';
                    break;
                default:
                    userType = 'unknown';
                    break;
            }
            self.user[userType] = profile;
            self.aboutMeText = self.user[userType]['bio'];
        }

        function getProfileError(error: any) {
            console.log(error);
        }
    }
}