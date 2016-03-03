import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import IUtility from 'core/service/data/utility'
import * as _mp from 'core/common/mapStrings'

export default class EcProviderSpToolCommenter {
    static controllerId = 'app.provider.sptools.commenter';
    static $inject = ['$uibModalInstance', '$scope', IDataCtx.serviceId, ICommon.serviceId, 'recipientId'];

    private isInstructor = false;
    authorRole: string;
    authorAvatar: string;
    authorName: string;
    commentType = _mp.MpCommentType;
    commentFlag = _mp.MpCommentFlag;
    comment: ecat.entity.ISpComment | ecat.entity.IFacSpComment;
    isNew = false;
    nf: angular.IFormController;
    recipientName: string;
    recipientAvatar: string;
    isSaveInProgress = false;
    

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private $scope: angular.IScope, private dCtx: IDataCtx, private c: ICommon, private recipientId: number) {

        const authorRole = this.authorRole = this.dCtx.user.persona.mpInstituteRole;
        let author: ecat.entity.IPerson;
        let recipient: ecat.entity.IPerson;

        if (authorRole === _mp.EcMapInstituteRole.student) {
            const spComment = this.dCtx.student.getOrAddComment(this.recipientId) as ecat.entity.ISpComment;
            author = spComment.author.studentProfile.person;
            recipient = spComment.recipient.studentProfile.person;
            this.comment = spComment;
        }
        else {
            const facComment = this.dCtx.faculty.getFacSpComment(this.recipientId) as ecat.entity.IFacSpComment;
            author = facComment.faculty.faculty.person;
            recipient = facComment.student.studentProfile.person;
            facComment['mpCommentType'] = _mp.MpCommentType.signed;
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
        if (this.comment.entityAspect.entityState.isAddedModifiedOrDeleted()) {
            this.comment.entityAspect.rejectChanges();
        }

        this.$mi.dismiss('canceled');
    }

    //TODO: need to write this!
    delete(): void {

        const self = this;
        this.isSaveInProgress = true;
       
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
        this.isSaveInProgress = true;

        const ctx = (this.authorRole === _mp.EcMapInstituteRole.student) ? 'student' : 'faculty';
        
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