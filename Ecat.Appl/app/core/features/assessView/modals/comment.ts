import IDataCtx from "core/service/data/context"
import ICommon from 'core/service/common'
import * as appVars from "appVars"

export default class EcAssessmentAddCommentForm {
    static controllerId = 'app.core.assessment.comment';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, ICommon.serviceId, 'recipientId', 'authorId'];

    comment: ecat.entity.ISpComment;
    recipientName: string;
    authorName: string;
    commentType = appVars.MpCommentType;
    commentFlag = appVars.MpCommentFlag;

    logSuccess = this.c.logSuccess("Comment Modal");
    logError = this.c.logError("Comment Modal");
    isSaveInProgress = this.dCtx.student.saveInProgress;

    canChangeComment = false;

    recipientAvatar: string;
    authorAvatar: string;

    nf: angular.IFormController;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private c: ICommon, private recipientId: number, private authorId: number) {

        console.log(recipientId);  
        this.activate();
 
    }

    activate(): void {
       
       const role =  this.dCtx.user.persona.mpInstituteRole;
       let authorPerson: ecat.entity.IPerson;
       let recipientPerson: ecat.entity.IPerson;

       if (role === appVars.EcMapInstituteRole.student) {

           this.canChangeComment = true;

           const comment = this.dCtx.student.getOrAddComment(this.recipientId, this.authorId);

           authorPerson = comment.author.student.person;
           recipientPerson = comment.recipient.student.person;

            this.recipientName = `${recipientPerson.firstName} ${recipientPerson.lastName}`;
            this.authorName = `${authorPerson.firstName} ${authorPerson.lastName}`;
            this.recipientAvatar = recipientPerson.avatarLocation || recipientPerson.defaultAvatarLocation;
            this.authorAvatar = authorPerson.avatarLocation || authorPerson.defaultAvatarLocation;

            this.comment = comment;


       }

    }

    //TODO: Need to code the delete method on the comment...

    //TODO: What happens to the comment when cancel
    cancel(): void {

        if (this.comment.entityAspect.entityState.isAddedModifiedOrDeleted()) {
            this.comment.entityAspect.rejectChanges();
        }

        this.$mi.dismiss('canceled');
    }

    commentError(errorMsg: any): void {
        this.logError('There was an error loading Courses', errorMsg, true);
        
    }

    //TODO: Should do a saveChanges before moving on 
    save(): void {

        if (this.isSaveInProgress) {

            const alertSettings: SweetAlert.Settings = {
                title: 'Warning',
                text: 'You have a save in progress please wait and try again',
                type: 'warning',
                confirmButtonText: 'Ok',
                closeOnConfirm: true,
                allowEscapeKey: true,
                allowOutsideClick: true,
                showCancelButton: false
            }

            this.c.swal(alertSettings);

        } else {
            this.comment.entityAspect.entityManager.saveChanges();
        }
    }
}