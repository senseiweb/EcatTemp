import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IInstructionsModal from "designer/features/instruments/modals/instructions"

export default class EcDesignerInstruments {
    static controllerId = 'app.designer.features.instruments';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];

    instruments: ecat.entity.ISpInstrument[];
    //selectedInstrument: Ecat.Models.EcInstrument;
    checkGroupType = {
        BC1: false,
        BC2: false,
        BC3: false,
        BC4: false
    }
    radioEduLevel: string;

    instructionsModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IInstructionsModal.controllerId,
        controllerAs: 'instructions',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/designer/features/instruments/modals/instructions.html',
        size: 'lg',
    };

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Designer Instruments Loaded');
        this.activate();
    }

    activate(): void {
        
    }

    select(instrument: any): void {//Ecat.Models.SpInstrument): void {
        //this.selectedInstrument = instrument;
        //this.radioEduLevel = this.selectedInstrument.MpEducationLevel;
        //this.checkGroupType = this.selectedInstrument.groupTypes;
        this.radioEduLevel = 'NCOA';
        this.checkGroupType.BC1 = true;
    }

    clone(cloneInstrument: any): void {
        
    }

    newAssessment(): void {

    }

    newBehavior(): void {

    }

    addEditInstructions(type: string): void {
        switch (type) {
            case 'Self':
                var instructions = 'Self instructions';
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => instructions
                    //passInstructions: () => this.selectedInstrument.selfInstructions
                }
                break;
            case 'Peer':
                var instructions = 'Peer instructions';
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => instructions
                    //passInstructions: () => this.selectedInstrument.peerInstructions
                }
                break;
            case 'Instructor':
                var instructions: string = null;
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => instructions
                    //passInstructions: () => this.selectedInstrument.instructorInstructions
                }
                break;
        }

        this.uiModal.open(this.instructionsModalOptions)
            .result
            .then(instructionsChanged)
            .catch(instructionsModalError);

        function instructionsChanged() {

        }

        function instructionsModalError() {

        }
    }
}