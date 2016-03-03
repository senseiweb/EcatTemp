import IDataCtx from 'core/service/data/context'

export default class EcFacultyWgAssess {
    static controllerId = 'app.faculty.wkgrp.assess';
    static $inject = [IDataCtx.serviceId];
    
    groupMembers: Array<ecat.entity.ICrseStudInGroup> = [];
    
    constructor(private dCtx: IDataCtx) {
        this.activate();
    }
    
    private activate(): void {
        this.dCtx.faculty.getActiveWorkGroup().then((wg: ecat.entity.IWorkGroup) => {
            wg.groupMembers.forEach(gm => {
                gm.getFacSpStatus();
            })
            this.groupMembers = wg.groupMembers[0].statusOfStudent
        })
    }
}