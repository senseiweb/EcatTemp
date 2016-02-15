import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import IInstructionsModal from "designer/features/instruments/modals/instructions"

export default class EcDesignerInstruments {
    static controllerId = 'app.designer.features.instruments';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId];

    instruments: ecat.entity.ISpInstrument[];

    instructionsModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IInstructionsModal.controllerId,
        controllerAs: 'instructions',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/designer/features/instruments/modals/instructions.html',
        size: 'lg',
        //resolve: { }
    };

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Designer Instruments Loaded');
        this.activate();
    }

    activate(): void {

    }

    addEditInstructions(): void {
        this.uiModal.open(this.instructionsModalOptions)
            .result
            .then(instructionsChanged)
            .catch(instructionsModalError);

        function instructionsChanged() {

        }

        function instructionsModalError() {

        }
    }

    //goToGroups(course: ecat.entity.ICourse) {
    //    this.dCtx.courseAdmin.selectedCourse = course;
    //}

}