import ICommon from "core/common/commonService"
import ISpTools from "provider/spTools/sptool"
import IDataCtx from 'core/service/data/context'
import * as _mp from "core/common/mapStrings"
import _swal from "sweetalert"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudAssessList {
    static controllerId = 'app.student.assessment.list';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];

    //#region Controller Properties
    protected activeSort: { opt: string, desc: boolean } = { opt: 'rankName', desc: false };
    protected activeGroup: ecat.entity.IWorkGroup;
    protected isResultPublished = true;
    protected isViewOnly = false;
    private log = this.c.getAllLoggers('Assessment Center');
    protected me: ecat.entity.ICrseStudInGroup;
    protected myStrat: ecat.entity.IStratResponse;
    protected peerStrats: Array<ecat.entity.IStratResponse>;
    protected peers: Array<ecat.entity.ICrseStudInGroup>;
    protected routingParams = { crseId: 0, wgId: 0 }
    protected sortOpt = {
        student: 'rankName',
        assess: 'assessText',
        comment: 'commentText',
        strat: 'stratText',
        composite: 'compositeScore'
    }
    protected sortStratOpt = {
        student: 'rankName',
        assess: 'assessText',
        comment: 'commentText',
        strat: 'stratText',
        composite: 'compositeScore'
    }
    protected stratInputVis: boolean;
    protected stratResponses: Array<ecat.entity.IStratResponse>;
    protected stratValComments: Array<ecat.entity.ICrseStudInGroup>;
    protected user: ecat.entity.IPerson;

    protected workGroups: ecat.entity.IWorkGroup[];
    //#endregion

    constructor(private c: ICommon, private dCtx: IDataCtx, private spTools: ISpTools) {
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
        this.user = this.dCtx.user.persona;
        const that = this;

        //This unwraps the promise and retrieves the objects inside and stores it into a local variable
        //TODO: Whatif there are no courses??
        this.dCtx.student.getActiveWorkGroup()
            .then(activationResponse)
            .catch(activationError);

        function activationResponse(wg: ecat.entity.IWorkGroup) {
            const grpMembers = wg.groupMembers;
            that.activeGroup = wg;
            const myId = that.dCtx.user.persona.personId;

            that.isViewOnly = wg.mpSpStatus !== _mp.MpSpStatus.open;

            that.me = grpMembers.filter(gm => gm.studentId === myId)[0];
            grpMembers.forEach(gm => {

                gm['hasChartData'] = that.me.statusOfPeer[gm.studentId].breakOutChartData.some(cd => cd.data > 0);

                if (that.isViewOnly) {
                    gm['assessText'] = (that.me.statusOfPeer[gm.studentId].assessComplete) ? 'View' : 'None';
                    gm['commentText'] = (that.me.statusOfPeer[gm.studentId].hasComment) ? 'View' : 'None';
                    gm['stratText'] = (that.me.statusOfPeer[gm.studentId].stratComplete) ? that.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
                } else {
                    gm['assessText'] = (that.me.statusOfPeer[gm.studentId].assessComplete) ? 'Edit' : 'Add';
                    gm['commentText'] = (that.me.statusOfPeer[gm.studentId].hasComment) ? 'Edit' : 'Add';
                    gm['stratText'] = (that.me.statusOfPeer[gm.studentId].stratComplete) ? that.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
                }
            });
            that.peers = grpMembers.filter(gm => gm.studentId !== myId);

            that.stratResponses = that.dCtx.student.getAllStrats();
            that.evaluateStrat();

            that.myStrat = that.stratResponses.filter(strat => strat.assessee.studentId === myId)[0];
            that.peerStrats = that.stratResponses.filter(strat => strat.assessee.studentId !== myId);
        }

        function activationError(error: any) {
            that.log.warn('There was an error loading Courses', error, true);
        }
    }

    private evaluateStrat(): void {
        this.spTools.evaluateStratification(this.activeGroup, false)
            .then((crseMems) => {
                this.stratValComments = crseMems;
            });
    }

    protected loadAssessment(assesseeId): void {
        if (!assesseeId) {
            return null;
        }

        //TODO: Add succes or failure logger
        this.spTools.loadSpAssessment(assesseeId, this.isViewOnly)
            .then(() => {
                if (this.isViewOnly) {
                    return;
                }
                const updatedPeer = this.peers.filter(peer => peer.studentId === assesseeId)[0];
                this.me.updateStatusOfPeer();
                updatedPeer['hasChartData'] = this.me.statusOfPeer[updatedPeer.studentId].breakOutChartData.some(cd => cd.data > 0);
                updatedPeer['assessText'] = this.me.statusOfPeer[updatedPeer.studentId].assessComplete ? 'Edit' : 'Add';
            })
            .catch(() => {
                //TODO: Error Handler to write
                console.log('Comment model errored');
            });
    }

    protected loadComment(recipientId): void {
        if (!recipientId) {
            return null;
        }

        //TODO: Add succes or failure logger
        this.spTools.loadSpComment(recipientId, this.isViewOnly)
            .then(() => {
                if (this.isViewOnly) {
                    return;
                }
                const updatedPeer = this.peers.filter(peer => peer.studentId === recipientId)[0];
                this.me.updateStatusOfPeer();
                updatedPeer['commentText'] = this.me.statusOfPeer[updatedPeer.studentId].hasComment ? 'Edit' : 'Add';
            })
            .catch(() => {
                //TODO: Error Handler to write
                console.log('Comment model errored');
            });
    }

    protected sortList(sortOpt: string): void {
        if (this.activeSort.opt === sortOpt) {
            this.activeSort.desc = !this.activeSort.desc;
            return;
        }

        this.activeSort.opt = sortOpt;
        this.activeSort.desc = true;
    }

    private sortByLastName(studentA: ecat.entity.ICrseStudInGroup, studentB: ecat.entity.ICrseStudInGroup) {
        if (studentA['name'] < studentB['name']) return -1;
        if (studentA['name'] > studentB['name']) return 1;
        return 0;
    }

    protected saveChanges(): angular.IPromise<void> {
        const that = this;
        const hasErrors = this.stratResponses.some(response => !response.isValid);

        if (hasErrors) {
            _swal('Not ready', 'Your proposed changes contain errors, please ensure all proposed changes are valid before saving', 'warning');
        }

        const changeSet = this.stratResponses.filter(response => response.proposedPosition !== null);

        changeSet.forEach(response => response.stratPosition = response.proposedPosition);


        return this.dCtx.student.saveChanges(changeSet)
            .then(saveChangesResponse)
            .catch(saveChangesError);

        function saveChangesResponse(): void {
            that.stratResponses.forEach((response) => {
                response.validationErrors = [];
                response.isValid = true;
                response.proposedPosition = null;
            });
            that.log.success('Save Stratification, Your changes have been made.', null, true);
        }

        //TODO: Need to write error handler
        function saveChangesError(reason: string): void {

        }

    }
}

const enum SortOpt {
    Student,
    Assess,
    Comment,
    Strat,
}

const enum StudAssessViews {
    PeerList,
    StratList,
    ResultMyReport,
    ResultComment
}