import ICommon from "core/common/commonService"
import IDataCtx from "core/service/data/context";
import * as _mp from "core/common/mapStrings"

enum PageTypeEnum {
    Main,
    HqStaff,
    Facilitator,
    Student,
    External,
    Connections
}

export default class EcUserProfile {
    static controllerId = 'app.user.profile';
    static $inject = ['$scope', ICommon.serviceId, IDataCtx.serviceId];

    aboutMeText: string;
    aboutMeForm: angular.IFormController;
    affiliationList = this.dCtx.static.milAffil;
    basicInfoForm: angular.IFormController;
    componentList = this.dCtx.static.milComponent;
    editing_aboutMeForm = false;
    editing_basicInfoForm = false;
    editing_studentInfoForm = false;
    editing_externalUserForm = false;
    externalUserForm: angular.IFormController;
    gender = _mp.EcMapGender;
    inflight = false;
    isLtiRole = false;
    isSaving = false;
    logWarning = this.c.logWarning('User Profile');
    logSuccess = this.c.logSuccess('User Profile');
    nonAllowList = {};
    pageTypeEnum = PageTypeEnum;
    page = this.pageTypeEnum.External;
    payGradeList = this.dCtx.static.milPaygradeList;
    payGradeEnum = _mp.EcMapPaygrade;
    showExternal = false;
    showStudent = false;
    showHq = false;
    showFaculty = false;
    studentInfoForm: angular.IFormController;
    user: ecat.entity.IPerson;
    userRoles = _mp.EcMapInstituteRole;

    constructor(private $scope, private c: ICommon, private dCtx: IDataCtx) {
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

        this.$scope.$on('$stateChangeStart', (event, toState: angular.ui.IState) => {
            const parentName = toState.parent as angular.ui.IState;

            if (!this.user.registrationComplete && parentName !== c.stateMgr.core.redirect.name) {
                event.preventDefault();
                c.swal('Registration Error', 'You muse complete your profile, before using the app', 'error');
            }
        });

        this.$scope.$on(c.coreCfg.coreApp.events.saveChangesEvent, (event: angular.IAngularEvent, data: Array<any>) => {
            this.inflight = data[0].inflight;
        });
    }

    cancelFormEdit(formName: string): void {
        if (!this[formName]['$dirty']) {
            this[`editing_${formName}`] = false;
            return null;
        }

        const settings: SweetAlert.Settings = {
            title: 'Wait a minute...'
        }

        settings.text = 'You have unsaved changes,  are you sure you would like to disregard all changes?';
        settings.allowEscapeKey = false;
        settings.type = 'warning';
        settings.showCancelButton = true;
        settings.confirmButtonColor = '#f44336';
        settings.confirmButtonText = 'Yes-Abort Changes';
        settings.closeOnCancel = false;
        settings.closeOnConfirm = false;

        swal(settings, (confirmed) => {
            if (confirmed) {
                this.user.entityAspect.rejectChanges();
                const activeForm = this[formName] as angular.IFormController;

                activeForm.$setPristine();

                this[`editing_${formName}`] = false;
                this.c.swal('Done!', 'Just like new again', 'success');

                if (this.showStudent) {
                    this.user.student.entityAspect.rejectChanges();
                }

                if (this.showFaculty) {
                    this.user.faculty.entityAspect.rejectChanges();
                }

                if (this.showExternal) {
                    this.user.external.entityAspect.rejectChanges();
                }
            } else {
                swal.close();
            }
        });
    }

    saveForm(formName: string) {

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
            this.dCtx.user.saveChanges()
                .then(() => {
                    this.logSuccess('Your changes were successfully saved!', null, true);
                    this[`editing_${formName}`] = false;
                })
                .catch(() => {
                    this.logWarning('Unable to save changes, Please try again later!', null, false);
                });
        }
    }

    updatePayGradeList(): void {
        const userWPaygrade = this.dCtx.static.updatePayGradeList(this.user);

        if (userWPaygrade) {
            this.user = userWPaygrade.user;
            this.payGradeList = userWPaygrade.paygradelist;
        }
    }

    private getProfile(): void {
        const self = this;
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

        function getProfileError(error: any) {
            console.log(error);
        }
    }
}