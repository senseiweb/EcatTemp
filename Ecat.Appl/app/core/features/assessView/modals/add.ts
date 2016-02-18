﻿import IDataCtx from "core/service/data/context"

export default class EcAssessmentAddForm {
    static controllerId = 'app.core.assessment.formAdd';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'mode'];

    nf: angular.IFormController;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, mode: string) {
        console.log(mode)
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    ok(): void {
        
    }
}