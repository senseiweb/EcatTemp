import ICommon from 'core/service/common'
import IDataCtx from "core/service/data/context";

enum PageTypeEnum {
    Facilitator,
    Student,
    External,
    Connections
}

export default class EcUserProfile {
    static controllerId = 'app.user.profile';
    static $inject = ['$scope',ICommon.serviceId, IDataCtx.serviceId]; 

    aboutMeText: string;
    aboutMeForm: angular.IFormController;
    affiliationList = this.dCtx.local.milAffil;
    basicInfoForm: angular.IFormController;
    componentList = this.dCtx.local.milComponent;
    editing_aboutMeForm = false;
    editing_basicInfoForm = false;
    editing_studentInfoForm = false;
    editing_externalUserForm = false;
    externalUserForm: angular.IFormController;
    gender = this.c.appVar.EcMapGender;
    inflight = false;
    isLtiRole = false;
    isSaving = false;
    logWarning = this.c.logWarning('User Profile');
    logSuccess = this.c.logSuccess('User Profile');
    nonAllowList = {};
    pageTypeEnum = PageTypeEnum;
    page = this.pageTypeEnum.External;
    payGradeList = this.dCtx.local.milPaygradeList;
    payGradeEnum = this.c.appVar.EcMapPaygrade;
    showExternal = false;
    showStudent = false;
    showFacilitator = false;
    studentInfoForm: angular.IFormController;
    user: ecat.entity.IPerson;
    userRoles = this.c.appVar.EcMapInstituteRole;

    constructor(private $scope, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Profile Loaded');
        this.user = dCtx.user.persona;

        this.getProfile();

        switch (this.user.mpInstituteRole) {
            case c.appVar.EcMapInstituteRole.student:
                this.isLtiRole = true;
                this.showStudent = true;
                this.page = PageTypeEnum.Student;
                break;
            case c.appVar.EcMapInstituteRole.facilitator:
                this.isLtiRole = true;
                this.showFacilitator = true;
                this.page = PageTypeEnum.Facilitator;
                break;
            case c.appVar.EcMapInstituteRole.external:
                this.isLtiRole = false;
                this.showExternal = true;
                this.page = PageTypeEnum.External;
                break;
            default:
                this.isLtiRole = false;
                this.page = PageTypeEnum.Connections;
                break;
        }

        this.$scope.$on('$stateChangeStart', (event, toState: angular.ui.IState) => {
            const parentName = toState.parent as angular.ui.IState;

            if (!this.user.isRegistrationComplete && parentName !== c.stateMgr.core.redirect.name ) {
                event.preventDefault();
                c.swal('Registration Error', 'You muse complete your profile, before using the app', 'error');
            }
        });

        this.$scope.$on(c.coreCfg.coreEvents.saveChangesEvent, (event: angular.IAngularEvent, data: Array<any>) => {
                this.inflight = data[0].inflight;
        });
    }

    cancelFormEdit(formName: string): void {
        if (!this[formName]['$dirty']) {
            this[`editing_${formName}`] = false;
            return null;
        }

        this.c.dialog.warningConfirmAlert('Wait a minute...', 'You have unsaved changes,  are you sure you would like to disregard all changes?', 'Yes-Abort Changes')
            .then(() => {
                this.user.entityAspect.rejectChanges();
                this[formName]['$setPristine()'];
                this[`editing_${formName}`] = false;
                this.c.swal('Done!', 'Just like new again', 'success');

                if (this.showStudent) {
                    this.user.student.entityAspect.rejectChanges();
                }

                if (this.showFacilitator) {
                    this.user.facilitator.entityAspect.rejectChanges();
                }

                if (this.showExternal) {
                    this.user.external.entityAspect.rejectChanges();
                }

            });
        return null;
    }

    saveForm(formName: string) {

        if (formName === 'aboutMeForm') {
            switch (this.user.mpInstituteRole) {
                case this.c.appVar.EcMapInstituteRole.student:
                    this.user.student.bio = this.aboutMeText;
                    break;
                case this.c.appVar.EcMapInstituteRole.facilitator:
                    this.user.facilitator.bio = this.aboutMeText;
                    break;
                case this.c.appVar.EcMapInstituteRole.external:
                    this.user.external.bio = this.aboutMeText;
                    break;
                default:
                    break;
            }
        }
   
        if (this[formName]['$valid']) {
            this.dCtx.user.saveUserChanges()
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
        const userWPaygrade = this.dCtx.local.updatePayGradeList(this.user);
        
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

        function getProfileResponse(profile: any) {
            let userType = '';
            switch (self.user.mpInstituteRole) {
                case self.c.appVar.EcMapInstituteRole.student:
                    userType = 'student';
                    break;
                case self.c.appVar.EcMapInstituteRole.facilitator:
                    userType = 'facilitator';
                    break;
                case self.c.appVar.EcMapInstituteRole.external:
                    userType = 'external';
                    break;
                default:
                    userType = 'external';
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