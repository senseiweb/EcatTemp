import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';

export default class EcDesignerInstruments {
    static controllerId = 'app.designer.features.instruments';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    instruments: ecat.entity.IInstrument[];

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Designer Instruments Loaded');
        this.activate();
    }

    activate(): void {

    }

    //goToGroups(course: ecat.entity.ICourse) {
    //    this.dCtx.courseAdmin.selectedCourse = course;
    //}

}