import ICommon from "core/common/commonService"
import IDataCtx from 'core/service/data/context'
import * as _mp from "core/common/mapStrings"
import _moment from "moment"
import _swal from "sweetalert"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudAssessResult {
    static controllerId = 'app.student.assessment.result';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    //#region Controller Properties
    protected activeView: StudAssessViews;
    protected hasComments = false;
    private log = this.c.getAllLoggers('Assessment Center');
    protected me: ecat.entity.ICrseStudInGroup;
    protected peers: Array<ecat.entity.ICrseStudInGroup>;
    protected resultInventory: Array<ecat.entity.ISpInventory>;
    protected routingParams = { crseId: 0, wgId: 0 }
    protected selectedComment: ecat.entity.ISantiziedComment;
    protected studentComments: Array<ecat.entity.ISantiziedComment>;
    protected sortOpt = {
        student: 'nameSorter.last',
        assess: 'assessText',
        comment: 'commentText',
        strat: 'stratText',
        composite: 'compositeScore'
    }
    protected sortStratOpt = {
        student: 'nameSorter.last',
        assess: 'assessText',
        comment: 'commentText',
        strat: 'stratText',
        composite: 'compositeScore'
    }
    protected view = {
        peer: StudAssessViews.PeerList,
        strat: StudAssessViews.StratList,
        myReport: StudAssessViews.ResultMyReport,
        comment: StudAssessViews.ResultComment
    }
    //#endregion

    constructor(private c: ICommon, private dCtx: IDataCtx) {
        if (c.$stateParams.crseId) {
            this.routingParams.crseId = c.$stateParams.crseId;
            dCtx.student.activeCourseId = c.$stateParams.crseId;
        }
        if (c.$stateParams.wgId) {
            this.routingParams.wgId = c.$stateParams.wgId;
            dCtx.student.activeGroupId = c.$stateParams.wgId;
        }
        this.activate();
    }

    private activate(): void {
        const that = this;

        this.dCtx.student.getWgSpResult()
            .then(activationResponse)
            .catch(activationError);

        function activationResponse(result: ecat.entity.ISpResult) {
            const groupMembers = that.dCtx.student.getActiveWgMemberships();
            that.me = groupMembers.filter(gm => gm.studentId === result.studentId)[0];

            groupMembers.forEach(gm => {
                gm['assessText'] = (that.me.statusOfPeer[gm.studentId].assessComplete) ? 'View' : 'None';
                gm['commentText'] = (that.me.statusOfPeer[gm.studentId].hasComment) ? 'View' : 'None';
                gm['stratText'] = (that.me.statusOfPeer[gm.studentId].stratComplete) ? that.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
            });

            that.peers = groupMembers.filter(gm => gm.studentId !== result.studentId);

            that.resultInventory = result.assignedInstrument.inventoryCollection;
            that.hasComments = result.sanitizedComments && result.sanitizedComments.length > 0;

            result.sanitizedComments.forEach(comment => {
                if (comment.authorName === 'Anonymous') {
                    comment['initials'] = 'A';
                } else if (comment.authorName === 'Instructor') {
                    comment['initials'] = 'I';
                } else {
                    const parts = comment.authorName.split(' ');

                    comment['initials'] = parts[0].charAt(0) + parts[1].charAt(0);
                }
            });        
            
            result.assignedInstrument.inventoryCollection.forEach(inv => {
                inv['needsEllipse'] = inv.behavior.length <= 50;
            });

            that.selectedComment = result.sanitizedComments[0];
            that.studentComments = result.sanitizedComments;
            that.activeView = StudAssessViews.ResultMyReport;
        }

        //TODO: Need to write an error handler
        function activationError(error: any) {
            that.log.warn('There was an error loading Courses', error, true);
        }
    }

    protected selectComment(comment: ecat.entity.ISantiziedComment): void {
        this.selectedComment = comment;
    }

}

const enum StudAssessViews {
    PeerList,
    StratList,
    ResultMyReport,
    ResultComment
}