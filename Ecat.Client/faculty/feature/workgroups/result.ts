import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgResult {
    static controllerId = 'app.faculty.wkgrp.result';
    static $inject = [IDataCtx.serviceId, ICommon.serviceId];

    private activeWg: ecat.entity.IWorkGroup;
    private groupMembers: Array<ecat.entity.ICrseStudInGroup>;
    private log = this.c.getAllLoggers('Faculty Wg Result');
    private selStud: ecat.entity.ICrseStudInGroup;
    protected view = WgResViews.Loading;

    constructor(private dCtx: IDataCtx, private c: ICommon) {
        const wgId = this.c.$stateParams.wgId;
        const crseId = this.c.$stateParams.crseId;
        if (!wgId || !crseId) {
            this.log.error('The required course ID and/or workgroup ID is missing. Try workgroup result option on the workgroup list screen', null, true);
            c.$state.go(c.stateMgr.faculty.wgList.name);
        } else {
            dCtx.faculty.activeCourseId = crseId;
            dCtx.faculty.activeGroupId = wgId;
            this.activate();
        }
    }

    private activate(): void {

      this.dCtx.faculty.fetchActiveWgSpResults().then((crseStudInGrp: Array<ecat.entity.ICrseStudInGroup>) => {
            this.activeWg = crseStudInGrp[0].workGroup;

           crseStudInGrp.forEach(gm => {
                gm.spResult;
            });
        });
    }
}

const enum WgResViews {
    Loading,
    List,
    Behaviors,
    Comments
}