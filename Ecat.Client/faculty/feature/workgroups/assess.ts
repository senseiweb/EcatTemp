import IDataCtx from 'core/service/data/context'
import ICommon from "core/common/commonService"

export default class EcFacultyWgAssess {
    static controllerId = 'app.faculty.wkgrp.assess';
    static $inject = ['$scope',ICommon.serviceId, IDataCtx.serviceId];
    

    private groupMembers: Array<ecat.entity.ICrseStudInGroup> = [];
    private log = this.c.getAllLoggers('Faculty Sp Assessment');

    constructor(private $scope, private c: ICommon, private dCtx: IDataCtx) {
        this.activate();
    }
    
    private activate(): void {
        const id = this.c.$stateParams.wgId;
        if (!id) {
            this.log.warn('No active workgroup was selected', null, true);
            return;
        }
        this.dCtx.faculty.activeGroupId = id;
        this.dCtx.faculty.getActiveWorkGroup().then((wg: ecat.entity.IWorkGroup) => {
            wg.groupMembers.forEach(gm => {
                gm.getFacSpStatus();
            });
            this.$scope.groupMembers = this.groupMembers = wg.groupMembers;
        });
    }
}