import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IInstructionsModal from "designer/features/instruments/modals/instructions"

interface IGroupTypes {
    [groupType: string]: boolean
}

export default class EcDesignerInstruments {
    static controllerId = 'app.designer.features.instruments';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];

    instruments: ecat.entity.ISpInstrument[];
    selectedInstrument: ecat.entity.ISpInstrument;
    //checkGroupType = {
    //    BC1: false,
    //    BC2: false,
    //    BC3: false,
    //    BC4: false
    //}
    checkGroupType: IGroupTypes = {}
    groupTypes: string[] = [];
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
        this.activate(false);
    }

    activate(force: boolean): void {
        const self = this;
        this.dCtx.designer.getInstruments(force)
            .then((retData: ecat.entity.ISpInstrument[]) => {
                this.instruments = retData;
                console.log('Designer Instruments Loaded');

                this.instruments.forEach(inst => {
                    //var found = this.groupTypes.some(gt => {
                    //    if (gt === inst.groupType) { return true; }
                    //});
                    //if (!found) { this.groupTypes.push(inst.groupType); }
                    //this.checkGroupType[inst.groupType] = false;
                });
            });
    }

    select(instrument: ecat.entity.ISpInstrument): void {
        this.selectedInstrument = instrument;
        //this.selectedInstrument.groupTypes.forEach(type => {
        //    this.checkGroupType[type] = true;
        //});
        //this.radioEduLevel = this.selectedInstrument.mpEduLevel;
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

    checkLock(): void {
        //if (this.selectedInstrument.used) {
            this.select(this.selectedInstrument);
        //}
    }

    refreshData(view: number): void {
        switch (view) {
            case 0:
                this.activate(true); break;
            case 1: 
            case 2:
                this.activate(true);
                this.select(this.selectedInstrument);
                break;
        }
    }

    save(): void {
        if (this.radioEduLevel !== null) {
            var typesFound = this.groupTypes.filter(type => {
                if (this.checkGroupType[type]) { return true; }
            });

            if (typesFound.length > 0) {
                //this.selectedInstrument.eduLevel = this.radioEduLevel;
                //typesFound.forEach(type => {
                //    this.selectedInstrument.groupTypes += type;
                //    this.selectedInstrument.groupTypes += '|';
                //});
            }
        }

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
        //var locked = !this.selectedInstrument.used;
        var locked = false;
        switch (type) {
            case 'Self':
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => this.selectedInstrument.selfInstructions,
                    locked: () => locked
                }
                break;
            case 'Peer':
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => this.selectedInstrument.peerInstructions,
                    locked: () => locked
                }
                break;
            case 'Instructor':
                this.instructionsModalOptions.resolve = {
                    passType: () => type,
                    passInstructions: () => this.selectedInstrument.facilitatorInstructions,
                    locked: () => locked
                }
                break;
        }

        this.uiModal.open(this.instructionsModalOptions)
            .result
            .then((retData: any) => instructionsChanged(retData))
            .catch(instructionsModalError);

        function instructionsChanged(retData: any) {
            if (retData === 'canceled') {
                //self.dCtx.designer.manager.rejectChanges();
            }
        }

        function instructionsModalError() {

        }
    }

}