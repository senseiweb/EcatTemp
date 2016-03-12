import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgResult {
    static controllerId = 'app.faculty.wkgrp.result';
    static $inject = [IDataCtx.serviceId, ICommon.serviceId];

    private activeWg: ecat.entity.IWorkGroup;
    private groupMembers: Array<ecat.entity.ICrseStudInGroup>;
    private selStud: ecat.entity.ICrseStudInGroup;
    protected view = WgResViews.Loading;

    constructor(private dCtx: IDataCtx, private c: ICommon) {
        const wgId = this.c.$stateParams.wgId;
        const crseId = this.c.$stateParams.crseId;
        if (!wgId || !crseId) {
            //this.log.warn('No active workgroup was selected', null, true);
            return;
        }
        this.dCtx.faculty.activeGroupId = wgId;
        this.dCtx.faculty.activeCourseId = crseId;
        this.dCtx.faculty.getActiveWorkGroup().then((wg: ecat.entity.IWorkGroup) => {
            this.activeWg = wg;

            wg.groupMembers.forEach(gm => {
                //const hasComment = gm.statusOfStudent.hasComment;
                //const assessComplete = gm.statusOfStudent.assessComplete;
                //gm['hasChartData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
                //let commentText = '';
                //let assessText = '';

                //if (this.isViewOnly) {
                //    commentText = hasComment ? 'View' : 'Not Available';
                //    assessText = assessComplete ? 'View' : 'Not Available';
                //} else {
                //    commentText = hasComment ? 'Edit' : 'Add';
                //    assessText = assessComplete ? 'Edit' : 'Add';
                //}
                //gm['commentText'] = commentText;
                //gm['assessText'] = assessText;
            });
            this.groupMembers = wg.groupMembers;
        });
    }
}

const enum WgResViews {
    Loading,
    List,
    Behaviors,
    Comments
}