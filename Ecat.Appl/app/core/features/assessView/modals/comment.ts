import IDataCtx from "core/service/data/context"
import * as appVars from "appVars"

export default class EcAssessmentAddCommentForm {
    static controllerId = 'app.core.assessment.comment';
    static $inject = ['$uibModalInstance',IDataCtx.serviceId, 'mode', 'comment'];

    nf: angular.IFormController;

    radioComment: string;

    mode: string;
    comment: any;


    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, mode: string, comment: Ecat.Shared.Model.SpComment) {

        console.log(comment);

        this.comment = comment;        
        this.activate();

    }

    activate(): void {
        this.radioComment = 'neutral';
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {
        
    }
}