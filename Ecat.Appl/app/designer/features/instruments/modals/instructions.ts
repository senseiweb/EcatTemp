export default class EcDesignerInstrumentInstructionsForm {
    static controllerId = 'app.designer.instruments.instructions';
    static $inject = ['$uibModalInstance', 'passType', 'passInstructions', 'locked'];

    nf: angular.IFormController;
    type: string;
    instructions: string;
    locked: boolean;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private passType: string, private passInstructions: string, locked: boolean) {
        this.type = passType;
        this.instructions = passInstructions;
        this.locked = locked;
    }

    cancel(): void {
        this.$mi.close('canceled');
    }

    ok(): void {

    }
}