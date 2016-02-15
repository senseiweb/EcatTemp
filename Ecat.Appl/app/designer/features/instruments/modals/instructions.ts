import IDataCtx from "core/service/data/context"

export default class EcDesignerInstrumentInstructionsForm {
    static controllerId = 'app.designer.instruments.instructions';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'passType', 'passInstructions'];

    nf: angular.IFormController;
    type: string;
    instructions: string;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private passType: string, private passInstructions: string) {
        this.type = passType;
        this.instructions = passInstructions;
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {

    }
}