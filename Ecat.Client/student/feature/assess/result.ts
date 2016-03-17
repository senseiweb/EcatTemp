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
    protected resultInventory: Array<ecat.entity.ISpInventory>;
    protected routingParams = { crseId: 0, wgId: 0 }
    protected selectedComment: ecat.entity.ISantiziedComment;
    protected studentComments: Array<ecat.entity.ISantiziedComment>;
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
            that.resultInventory = result.assignedInstrument.inventoryCollection;
            that.hasComments = result.sanitizedComments && result.sanitizedComments.length > 0;
            result.sanitizedComments.forEach(comment => {
                if (comment.authorName === 'Anonymous') {
                    comment['initials'] = 'A';
                } else {
                    const parts = comment.authorName.split(' ');

                    comment['initials'] = parts[0].charAt(0) + parts[1].charAt(0);
                }
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