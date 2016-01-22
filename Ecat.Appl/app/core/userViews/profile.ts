import IDataCtx from 'core/service/data/context'
import ICommon from 'core/service/common'
import ILocal from 'core/service/data/local'
import IDialog from 'core/service/dialog'
import IStateMgr from "core/provider/ecStateProvider"
import * as AppVar from 'appVars'

enum PageTypeEnum {
    Facilitator,
    Student,
    External
}

export default class EcUserProfile {
    static controllerId = 'app.user.profile';
    static $inject = ['$scope',ICommon.serviceId, IDataCtx.serivceId, ILocal.serviceId, IDialog.serviceId, IStateMgr.providerId]; 

    gender = AppVar.EcMapGender;
    aboutMeForm: angular.IFormController;
    basicInfoForm: angular.IFormController;
    editing_aboutMeForm = false;
    editing_basicInfoForm = false;
    editing_studentInfoForm = false;
    inflight = false;
    isFacilitator = false;
    isLtiRole = false;
    isSaving = false;
    isStudent = false;
    logWarning = this.common.logger.getLogFn(EcUserProfile.controllerId, AppVar.EcMapAlertType.warning);
    logSuccess = this.common.logger.getLogFn(EcUserProfile.controllerId, AppVar.EcMapAlertType.success);
    nonAllowList = {};
    pageTypeEnum = PageTypeEnum;
    page = this.pageTypeEnum.External;
    payGradeList: Array<{ pg: string, displayName: string }> = [];
    studentInfoForm: angular.IFormController;
    user: ecat.entity.IPerson;

    constructor($scope: angular.IScope, private common: ICommon, private dataCtx: IDataCtx, private local: ILocal, private dialog: IDialog, private stateMgr: IStateMgr) {
        console.log('Profile Loaded');
        this.user = dataCtx.user.persona;
        this.isStudent = this.user.mpInstituteRole === AppVar.EcMapInstituteRole.student;
        this.isFacilitator = this.user.mpInstituteRole === AppVar.EcMapInstituteRole.facilitator;

        this.getProfile();
        
        if (this.isStudent) {
            this.page = PageTypeEnum.Student;
            this.isLtiRole = true;
        } else if (this.isFacilitator) {
            this.page = PageTypeEnum.Facilitator;
            this.isLtiRole = true;
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

                if (this.isStudent) {
                    this.user.student.entityAspect.rejectChanges();
                }

                if (this.isFacilitator) {
                    this.user.facilitator.entityAspect.rejectChanges();
                }

            });
        return null;
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
            switch (self.user.mpInstituteRole) {
                case AppVar.EcMapInstituteRole.student:
                    self.user.student = profile;
                    break;
                case AppVar.EcMapInstituteRole.facilitator:
                    self.user.facilitator = profile;
                    break;
                default:
                    getProfileError();
                break;
            }
        }

        function getProfileError() {
            if (!self.isStudent && !self.isFacilitator) {
                return null;
            }



        }
    }
}