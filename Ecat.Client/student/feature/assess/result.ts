import ICommon from "core/common/commonService"
import IDataCtx from 'core/service/data/context'
import ISptools from "provider/spTools/sptool"
import * as _mp from "core/common/mapStrings"
import _moment from "moment"
import _swal from "sweetalert"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudAssessResult {
    static controllerId = 'app.student.assessment.result';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId, ISptools.serviceId];

    //#region Controller Properties
    protected activeView = StudResultViews.None;
    protected hasComments = false;
    private log = this.c.getAllLoggers('Assessment Center');
    protected me: ecat.entity.ICrseStudInGroup;
    protected peers: Array<ecat.entity.ICrseStudInGroup>;
    protected resultInventory: Array<ecat.entity.ISpInventory>;
    protected isReviewing = false;
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
        none: StudResultViews.None,
        assess: StudResultViews.Assess,
        behavior: StudResultViews.Behavior,
        comment: StudResultViews.Comment
    }
    //#endregion

    constructor(private c: ICommon, private dCtx: IDataCtx, private sptool: ISptools) {
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

        this.dCtx.student.getActiveWorkGroup()
            .then(activationResponse)
            .catch(activationError);

        function activationResponse(wg: ecat.entity.IWorkGroup) {

            const myId = that.dCtx.user.persona.personId;

            const groupMembers = wg.groupMembers;

            that.me = groupMembers.filter(gm => gm.studentId === myId)[0];
            that.me['hasChartData'] = that.me.statusOfPeer[that.me.studentId].breakOutChartData.some(cd => cd.data > 0);

            that.me.updateStatusOfPeer();

            groupMembers.forEach(gm => {
                gm['hasChartData'] = that.me.statusOfPeer[gm.studentId].breakOutChartData.some(cd => cd.data > 0);
                gm['assessText'] = (that.me.statusOfPeer[gm.studentId].assessComplete) ? 'View' : 'None';
                gm['commentText'] = (that.me.statusOfPeer[gm.studentId].hasComment) ? 'View' : 'None';
                gm['stratText'] = (that.me.statusOfPeer[gm.studentId].stratComplete) ? that.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
            });

            that.peers = groupMembers.filter(gm => gm.studentId !== myId);

            if (wg.mpSpStatus === _mp.MpSpStatus.published) {
                that.isReviewing = false;
                return that.getResults();
            } else {
                that.isReviewing = true;
                that.activeView = StudResultViews.Assess;
            }
        }

        //TODO: Need to write an error handler
        function activationError(error: any) {
            that.log.warn('There was an error loading Courses', error, true);
        }
    }

    private getResults(): angular.IPromise<void> {
        const that = this;
        that.log.success('Results for the workgroup have been published. Standby while I get them', this.me, true);

        return this.dCtx.student.getWgSpResult()
            .then(getResultsResponse)
            .catch(getResultsError);

        function getResultsResponse(result: ecat.entity.ISpResult): void {
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

            that.resultInventory.forEach(inv => {
                inv['needsEllipse'] = inv.behavior.length <= 50;
            });

            that.selectedComment = result.sanitizedComments[0];
            that.studentComments = result.sanitizedComments;
            that.activeView = StudResultViews.Assess;
        }

        //TODO: Need to write error hanler
        function getResultsError(): void {
            
        }
    }

    protected loadAssessment(studentId: number): void {
        this.sptool.loadSpAssessment(studentId, true);
    }

    protected loadComment(studId: number): void {
        this.sptool.loadSpComment(studId, true);
    }

    protected selectComment(comment: ecat.entity.ISantiziedComment): void {
        this.selectedComment = comment;
    }

    protected switchView(view: StudResultViews) {


        this.activeView = view;
    }
}

const enum StudResultViews {
    None,
    Assess,
    Behavior,
    Comment
}