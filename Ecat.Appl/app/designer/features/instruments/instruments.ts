import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IInstructionsModal from "designer/features/instruments/modals/instructions"

export default class EcDesignerInstruments {
    static controllerId = 'app.designer.features.instruments';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];

    instruments: ecat.entity.ISpInstrument[];
    selectedInstrument: ecat.entity.ISpInstrument;
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
        this.activate();
    }

    activate(): void {
        const self = this;
        this.dCtx.designer.getInstruments()
            .then((retData: ecat.entity.ISpInstrument[]) => {
                this.instruments = retData;
                console.log('Designer Instruments Loaded');
            });
    }

    select(instrument: ecat.entity.ISpInstrument): void {
        this.selectedInstrument = instrument;
        //this.radioEduLevel = this.selectedInstrument.MpEducationLevel;
        //this.checkGroupType = this.selectedInstrument.groupTypes;
        this.radioEduLevel = 'NCOA';
        this.checkGroupType.BC1 = true;
    }

    cloneInstrument(subject: ecat.entity.ISpInstrument): void {
        var latestVersion: number = 0;
        this.instruments.forEach(inst => {
            //if (inst.eduLevel === subject.eduLevel) {
            //    if (inst.groupType === subject.groupType) {
            //        if (inst.version > latestVersion) {
            //            latestVersion = inst.version;
            //        }
            //    }
            //}
        });

        this.select(this.dCtx.designer.cloneInstrument(subject, (latestVersion + 1)));
    }

    newAssessment(): void {
        var newInstrument = this.dCtx.designer.getNewInstrument();
        this.instruments.push(newInstrument);
        this.select(newInstrument);
    }

    newBehavior(): void {
        this.selectedInstrument.inventoryCollection.push(this.dCtx.designer.getNewInventory(this.selectedInstrument));
    }

    save(): void {
        this.dCtx.designer.saveChanges()
            .then((retData: breeze.SaveResult) => saved(retData))
            .catch((retData: any) => rejected(retData));

        function saved(retData: breeze.SaveResult): void {

        }

        function rejected(retData: any): void {

        }
    }

    addEditInstructions(type: string): void {
        const self = this;
        switch (type) {
            case 'Self':
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => this.selectedInstrument.selfInstructions
                }
                break;
            case 'Peer':
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => this.selectedInstrument.peerInstructions
                }
                break;
            case 'Instructor':
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => this.selectedInstrument.facilitatorInstructions
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