import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"
import IAcademyAe from "admin/academy/addEdit"

export default class EcSysAdminAcademy{
    static controllerId = 'app.admin.academy';
    static $inject = ['$uibModal', IDataCtx.serviceId, ICommon.serviceId];

    aeModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAcademyAe.controllerId,
        controllerAs: 'acadAe',
        bindToController: true,
        keyboard: false,
        templateUrl: 'wwwroot/app/admin/academy/addEdit.html'
    };
    newAcademyForm: angular.IFormController;


    constructor(private uiModal: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon) {
        console.log('Admin Academy Loaded');
    }

    addAcademy(): void {
        this.uiModal.open(this.aeModalOptions)
            .result
            .then(academySaved)
            .catch(academyError);
        
        function academySaved() {
            
        }

        function academyError() {
            
        }
    }

    saveAcademy(): void {
        
    }

}