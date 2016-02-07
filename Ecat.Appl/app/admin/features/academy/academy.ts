import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"
import IAcademyAe from "admin/features/academy/addEdit"

export default class EcSysAdminAcademy{
    static controllerId = 'app.admin.academy';
    static $inject = ['$uibModal', IDataCtx.serviceId, ICommon.serviceId];

    academyList: Array<ecat.entity.IAcademy>;
    aeModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: IAcademyAe.controllerId,
        controllerAs: 'acadAe',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'wwwroot/app/admin/academy/addEdit.html'
    };
    
    logSuccess = this.c.logSuccess('SysAdmin Acadmey');
    logWarn = this.c.logWarning('SysAdmin Acadmey');
    logError = this.c.logError('SysAdmin Acadmey');

    newAcademyForm: angular.IFormController;

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon) {
        console.log('Admin Academy Loaded');
        this.activate();
    }

    activate(): void {
        const self = this;

        this.dCtx.sysAdmin.getAcademies()
            .then(getAcademiesResponse)
            .catch(this.queryFailed);

        function getAcademiesResponse(academies: Array<ecat.entity.IAcademy>) {
            if (academies.length === 0) {
                    self.logSuccess('The query succeeded, but no items where found.', academies, true);
            }
            self.academyList = academies;
        }
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

    queryFailed(error): void {
        
    }

}