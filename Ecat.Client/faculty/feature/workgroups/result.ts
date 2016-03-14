import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgResult {
    static controllerId = 'app.faculty.wkgrp.result';
    static $inject = [IDataCtx.serviceId, ICommon.serviceId];

    private activeWg: ecat.entity.IWorkGroup;
    private groupMembers: Array<ecat.entity.ICrseStudInGroup>;
    private log = this.c.getAllLoggers('Faculty Wg Result');
    protected wgResults: Array<ecat.entity.ICrseStudInGroup>;
    private routingParams = { crseId: 0, wgId: 0 };
    private activeStudResult: ecat.entity.ICrseStudInGroup;
    protected viewState = WgResViews.Loading;

    constructor(private dCtx: IDataCtx, private c: ICommon) {
        this.routingParams.wgId = this.c.$stateParams.wgId;
        this.routingParams.crseId = this.c.$stateParams.crseId;
        this.activate();
    }

    private activate(): void {
        const that = this;
        if (!this.routingParams.wgId || !this.routingParams.crseId) {
            this.log.error('The required course ID and/or workgroup ID is missing. Try workgroup result option on the workgroup list screen', null, true);
            this.c.$state.go(this.c.stateMgr.faculty.wgList.name);
            return null;
        }

        this.dCtx.faculty.activeCourseId = this.routingParams.crseId;
        this.dCtx.faculty.activeGroupId = this.routingParams.wgId;
     
        this.dCtx.faculty.fetchActiveWgSpResults()
            .then(activateResponse);

        function activateResponse(groupMembers: Array<ecat.entity.ICrseStudInGroup>) {
            that.activeWg = groupMembers[0].workGroup;
            that.viewState = WgResViews.List;
            if (that.activeWg.mpSpStatus !== _mp.MpSpStatus.published) {
                that.c.$state.go(that.c.stateMgr.faculty.wgList.name);
                return null;
            }
            
            groupMembers.forEach(gm => {
                gm['hasReceivedCharData'] = gm.resultForStudent.breakOutReceived.some(cd => cd.data > 0);
                gm['hasGivenCharData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
            })

            that.wgResults = groupMembers;
        }
    }

    protected switchTo(state: string) {
        switch (state) {
            case 'list':
                this.viewState = WgResViews.List;
                break;
            case 'behavior':
                this.viewState = WgResViews.Behavior;
                break;
            case 'comment':
                this.viewState = WgResViews.Comment;
                break;
            default:
                this.viewState = WgResViews.Loading;
        }
    }
}

const enum WgResViews {
    Loading,
    List,
    Behavior,
    Comment
}