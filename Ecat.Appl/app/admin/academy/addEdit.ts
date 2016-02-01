﻿import IDataCtx from "core/service/data/context"

export default class EcAdminAcademyAddForm {
    static controllerId = 'app.admin.academy.formAdd';
    static $inject = ['$uibModalInstance',IDataCtx.serviceId];

    academy: ecat.entity.IAcademy;
    bbCatList: Array<Ecat.Models.AcademyCategory> = [];
    isLoadingCats = false;
    nf: angular.IFormController;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx) {
        this.academy = dCtx.sysAdmin.createAcademyLocal();
        this.getCategoryList();
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    getCategoryList(): void {
        this.isLoadingCats = true;
        this.dCtx.sysAdmin.getCategoryList()
            .then((catList) => {
                this.bbCatList = catList as any;
            }).finally(() => {
                this.isLoadingCats = false;
            });
    }

    ok(): void {
        
    }
}