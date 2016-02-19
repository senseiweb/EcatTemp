import IDataCtx from "core/service/data/context"
import * as appVars from "appVars"

export default class EcAssessmentAddForm {
    static controllerId = 'app.core.assessment.formEdit';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'assessment'];

    nf: angular.IFormController;

    spResponses: any;
    radioEffectiveness: string;
    radioFreq: string;
    response: ecat.entity.ISpAssess;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, assessment: any) {
        console.log('Assessment Loaded');
        this.activate();
    }

    activate(): void {
        


    }

    checkResponse(): void {

    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {
        
    }

    alert(): void {

        alert('Failure');
    }
}