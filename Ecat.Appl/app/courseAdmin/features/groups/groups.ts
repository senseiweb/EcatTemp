import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';

export default class EcCourseAdminGroups {
    static controllerId = 'app.courseAdmin.features.groups';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    groups: ecat.entity.IGroup[] = [];
    groupMembers: ecat.entity.IGroupMember[] = [];

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Course Admin Groups Loaded');
        this.activate();
    }

    activate(): void {
        
    }

    pollGroups(): void {

    }

    pollEnrollments(): void {

    }
}