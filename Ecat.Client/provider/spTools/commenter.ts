import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import IUtility from 'core/service/data/utility'
import * as _mp from 'core/common/mapStrings'
import _swal from "sweetalert"

export default class EcProviderSpToolCommenter {
    static controllerId = 'app.provider.sptools.commenter';
    static $inject = ['$uibModalInstance', '$scope', IDataCtx.serviceId, ICommon.serviceId, 'recipientId', 'viewOnly'];

    private authorRole: string;
    private authorAvatar: string;
    private authorName: string;
    protected anonymityFlag = {
        true: true,
        false: false
    }
    private commentType = _mp.MpCommentType;
    private commentFlag = _mp.MpCommentFlag;
    private comment: ecat.entity.IStudSpComment | ecat.entity.IFacSpComment;
    private isInstructor = false;
    private isNew = false;
    private isPublished = false;
    private nf: angular.IFormController;
    private recipientName: string;
    private recipientAvatar: string;
    private isSaveInProgress = false;
    

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private $scope: angular.IScope, private dCtx: IDataCtx, private c: ICommon, private recipientId: number, private viewOnly: boolean) {
        this.isPublished = viewOnly;
        const authorRole = this.authorRole = this.dCtx.user.persona.mpInstituteRole;
        let author: ecat.entity.IPerson;
        let recipient: ecat.entity.IPerson;

        if (authorRole === _mp.MpInstituteRole.student) {
            const spComment = this.dCtx.student.getOrAddComment(this.recipientId) as ecat.entity.IStudSpComment;
            author = spComment.author.studentProfile.person;
            recipient = spComment.recipient.studentProfile.person;
            this.comment = spComment;
        }
        else {
            const facComment = this.dCtx.faculty.getFacSpComment(this.recipientId) as ecat.entity.IFacSpComment;
            author = this.dCtx.user.persona;
            recipient = facComment.recipient.studentProfile.person;
            facComment['requestAnonymity'] = false;
            this.isInstructor = true;
            this.comment = facComment;
        }
        this.recipientName = `${recipient.firstName} ${recipient.lastName}`;
        this.authorName = `${author.firstName} ${author.lastName}`;
        this.authorAvatar = author.avatarLocation || author.defaultAvatarLocation;
        this.recipientAvatar = recipient.avatarLocation || recipient.defaultAvatarLocation;
        this.isNew = this.comment.entityAspect.entityState === breeze.EntityState.Added;


        //Not sure where to put this
        $scope.$watch('this.dCtx.student.saveInProgress', (newValue: string, oldValue: string) => {
            if (newValue) {
                this.isSaveInProgress = true;
            } else {
                this.isSaveInProgress = false;
            }
        });

    }

    cancel(): void {

        const that = this;

        if (this.isPublished) {
            this.$mi.close('Results are Published');
        }

        if (this.nf.$dirty) {
            const alertSetting: SweetAlert.Settings = {
                title: 'Caution, Unsaved Changes',
                text: 'You have made changes to this comment that have not been saved.\n\n Are you sure you want to cancel them?',
                type: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                closeOnCancel: true,
                closeOnConfirm: true,
                confirmButtonColor: '#F44336',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            };

            _swal(alertSetting, (confirmed?: boolean) => {
                if (confirmed) {


                    if (this.comment.flag.entityAspect.entityState.isAddedModifiedOrDeleted()) {
                        this.comment.flag.entityAspect.rejectChanges();
                    }

                    if (this.comment.entityAspect.entityState.isAddedModifiedOrDeleted()) {
                        this.comment.entityAspect.rejectChanges();

                    }

                    this.$mi.dismiss('Changes not saved');
                } 
            });

        } else {
            this.$mi.dismiss('Canceled');
        }
    }

    delete(): void {

        const self = this;
        this.isSaveInProgress = true;

        if (this.comment.entityAspect.entityState.isAdded()) {
            this.cancel();
            return null;
        }

       
        const swalSettings: SweetAlert.Settings = {
            title: 'Are you sure?',
            text: 'You will not be able to recover this comment.',
            type: 'warning',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#F44336',
            showCancelButton: true,
            allowEscapeKey: true
            
        }

        function afterConfirmDelete(confirmed: boolean)
        {
            if (!confirmed) {
                return;
            }

            self.comment.entityAspect.setDeleted();
            self.save();
        }

        this.c.swal(swalSettings, afterConfirmDelete);
        
    }

    save(): void {
        if (this.isPublished) {
            const swalPubSettings: SweetAlert.Settings = {
                title: 'How did you get here!',
                text: 'The workgroup status has been set to published, no changes are allowed!',
                type: 'error',
                allowEscapeKey: true,
                confirmButtonText: 'Ok'
            }
            return this.c.swal(swalPubSettings);
        }
        this.isSaveInProgress = true;

        const ctx = (this.authorRole === _mp.MpInstituteRole.student) ? 'student' : 'faculty';
        
        const saveCtx = this.dCtx[ctx] as IUtility;
        const swalSettings: SweetAlert.Settings = {
            title: 'Oh no!, there was a problem updating this comment. Try saving again, or cancel the current comment and attempt this again later.',
            type: 'error',
            allowEscapeKey: true,
            confirmButtonText: 'Ok'
        }
    //TODO: need to write a finally method for canceling saveinprogress
        saveCtx.saveChanges()
            .then(() => {
                this.$mi.close();
            })
            .catch(() => {
                this.c.swal(swalSettings);
            });
    }
}