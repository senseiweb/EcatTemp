export default class EcDesignerInstrumentInstructionsForm {
    static controllerId = 'app.designer.instruments.instructions';
    static $inject = ['$uibModalInstance', 'passType', 'passInstructions'];

    nf: angular.IFormController;
    type: string;
    instructions: string;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private passType: string, private passInstructions: string) {
        this.type = passType;
        this.instructions = passInstructions;
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {

    }
}