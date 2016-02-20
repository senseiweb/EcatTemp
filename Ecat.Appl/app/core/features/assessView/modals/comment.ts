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

    canChangeComment = false;

    recipientAvatar: string;
    authorAvatar: string;

    nf: angular.IFormController;

    radioComment: string;

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

        this.radioComment = this.comment.mpCommentFlagAuthor;
    }

    //TODO: Need to code the delete method on the comment...

    //TODO: What happens to the comment when cancel
    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    commentError(error: any): void {
        //this.c.logError('There was an error loading Courses', error, true);
        
    }

    //TODO: Should do a saveChanges before moving on 
    save(): void {
        //this.dCtx.student.saveChanges()
        //    .then()
        //    .catch(this.commentError)
        //    .finally();
    }
}