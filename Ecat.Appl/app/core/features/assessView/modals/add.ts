import IDataCtx from "core/service/data/context"

export default class EcAssessmentAddForm {
    static controllerId = 'app.core.assessment.formAdd';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'mode'];

    nf: angular.IFormController;
    mode: string;
    assessee: ecat.entity.IMemberInGroup;
    instrument: Ecat.Shared.Model.SpInstrument;
    spResponses: Ecat.Shared.Model.SpAssessResponse[] = [];
    facResponses: Ecat.Shared.Model.FacSpAssessResponse[] = [];

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, mode: string, groupMember: ecat.entity.IMemberInGroup) {
        this.mode = mode;
        this.assessee = groupMember;
        //switch (mode) {
        //    case 'facilitator':
        //    case 'student':
        //}

        console.log(mode);
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {
        
    }
}