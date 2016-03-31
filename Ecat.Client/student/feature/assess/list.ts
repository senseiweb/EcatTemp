import ICommon from "core/common/commonService"
import ISpTools from "provider/spTools/sptool"
import IDataCtx from 'core/service/data/context'
import * as _mp from "core/common/mapStrings"
import _swal from "sweetalert"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudAssessList {
    static controllerId = 'app.student.assessment.list';
    static $inject =  ['$scope',ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];

    //#region Controller Properties

    protected activeSort: { opt: string, desc: boolean } = { opt: 'nameSorter.last', desc: false };
    protected activeView = StudListViews.None;
    protected doneWithAssess = false;
    protected doneWithStrats = false;
    protected groupCount= 0;
    protected instructions: string;
    private log = this.c.getAllLoggers('Assessment Center [LV]');
    protected me: ecat.entity.ICrseStudInGroup;
    protected peers: Array<ecat.entity.ICrseStudInGroup>;
    protected routingParams = { crseId: 0, wgId: 0 }
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
    private user: ecat.entity.IPerson;
    protected view = {
        peers: StudListViews.PeerList,
        strats: StudListViews.StratList
    }
    //#endregion

    constructor(private $scope: angular.IScope, private c: ICommon, private dCtx: IDataCtx, private spTools: ISpTools) {

        if (c.$stateParams.crseId) {
            this.routingParams.crseId = c.$stateParams.crseId;
            dCtx.student.activeCourseId = c.$stateParams.crseId;
        }
        if (c.$stateParams.wgId) {
            this.routingParams.wgId = c.$stateParams.wgId;
            dCtx.student.activeGroupId = c.$stateParams.wgId;
        }

        $scope.$on('$stateChangeStart', ($event: angular.IAngularEvent, to: angular.ui.IState, toParams: {}, from: angular.ui.IState, fromParams: {}) => this.handleUnsavedStrats().catch(() => $event.preventDefault()));

        this.activate();
    }

    private activate(): void {
        this.user = this.dCtx.user.persona;
        const that = this;

        //This unwraps the promise and retrieves the objects inside and stores it into a local variable
        //TODO: Whatif there are no courses??
        this.dCtx.student.fetchActiveWorkGroup()
            .then(activationResponse)
            .catch(activationError);

        function activationResponse(wg: ecat.entity.IWorkGroup) {
            const grpMembers = that.dCtx.student.getActiveWgMemberships();
            that.groupCount = grpMembers.length;
            const myId = that.dCtx.user.persona.personId;
            that.me = grpMembers.filter(gm => gm.studentId === myId)[0];

            if (!that.me.hasAcknowledged) that.instructions = wg.assignedSpInstr.studentInstructions;

            that.me.updateStatusOfPeer();

            grpMembers.forEach(gm => {
                gm['hasChartData'] = that.me.statusOfPeer[gm.studentId].breakOutChartData.some(cd => cd.data > 0);
                gm['assessText'] = (that.me.statusOfPeer[gm.studentId].assessComplete) ? 'Edit' : 'Add';
                gm['commentText'] = (that.me.statusOfPeer[gm.studentId].hasComment) ? 'Edit' : 'Add';
                gm['stratText'] = (that.me.statusOfPeer[gm.studentId].stratComplete) ? that.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
            });

            that.peers = grpMembers.filter(gm => gm.studentId !== myId);
            that.activeView = StudListViews.PeerList;
        }

        function activationError(error: any) {
            that.log.warn('There was an error loading Courses', error, true);
        }
    }

    private evaluateStrat(force?: boolean): void {
        this.spTools.evaluateStratification(false, force)
            .then(() => {
                this.peers = this.dCtx.student.getActiveWgMemberships()
                    .filter(gm => gm.studentId !== this.me.studentId);
                this.me = this.dCtx.student.getActiveWgMemberships()
                    .filter(gm => !gm.entityAspect.entityState.isDetached())
                    .filter(gm => gm.studentId === this.me.studentId)[0];
            });
    }
    
    private handleUnsavedStrats(): angular.IPromise<any> {
        const deferred = this.c.$q.defer();

        const alertSettings: SweetAlert.Settings = {
            title: 'Wait a minute!',
            text: 'You have unsaved changes',
            closeOnConfirm: true,
            closeOnCancel: true,
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Continue'
        }

        const gmWithUnsavedStrats = this.dCtx.student
            .getActiveWgMemberships()
            .filter(gm => gm.proposedStratPosition !== null);

        //TODO: Jason fix up text
        alertSettings.text = `${alertSettings.text}`;

        if (gmWithUnsavedStrats.length === 0) {
            deferred.resolve();
            return deferred.promise;
        }

        _swal(alertSettings, (confirmed?: boolean) => {

            if (!confirmed) {
                deferred.reject('User Canceled');
            };

            gmWithUnsavedStrats.forEach(gm => {
                gm.proposedStratPosition = null;
                gm.stratValidationErrors = [];
                gm.stratIsValid = true;
            });
            deferred.resolve();
        });
        return deferred.promise;
    }

    protected loadAssessment(assesseeId): void {
        if (!assesseeId) {
            return null;
        }

        //TODO: Add succes or failure logger
        this.spTools.loadSpAssessment(assesseeId, false)
            .then(() => {
                let updatedPeer = this.peers.filter(peer => peer.studentId === assesseeId)[0];

                if (!updatedPeer) {
                    updatedPeer = this.me;
                }

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
        this.spTools.loadSpComment(recipientId, false)
            .then(() => {
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

    protected saveChanges(changeSet?: Array<ecat.entity.IStratResponse>): angular.IPromise<void> {
        const that = this;

        return this.dCtx.student.saveChanges(changeSet)
            .then(saveChangesResponse)
            .catch(saveChangesError);

        function saveChangesResponse(): void {
            that.me.updateStatusOfPeer();
            that.log.success('Success, Your changes have been made.', null, true);
        }

        //TODO: Need to write error handler
        function saveChangesError(reason: string): void {

        }

    }

    protected saveChangesStrats(): angular.IPromise<void> {
        this.evaluateStrat(true);

        const hasErrors = this.dCtx.student.getActiveWgMemberships()
            .some(gm => !gm.stratIsValid);

        if (hasErrors) {
            _swal('Not ready', 'Your proposed changes contain errors, please ensure all proposed changes are valid before saving', 'warning');
            return null;
        }

        const gmWithChanges = this.dCtx.student.getActiveWgMemberships()
            .filter(gm => gm.proposedStratPosition !== null);

        const changeSet = [] as Array<ecat.entity.IStratResponse>;

        gmWithChanges.forEach(gm => {
            const stratResponse = this.dCtx.student.getSingleStrat(gm.studentId);
            stratResponse.stratPosition = gm.proposedStratPosition;
            changeSet.push(stratResponse);
        });

        return this.saveChanges(changeSet).then(() => {
            const groupMembers = this.dCtx.student.getActiveWgMemberships();
            groupMembers.filter(gm => changeSet.some(cs => cs.assesseePersonId === gm.studentId))
                .forEach(gm => {
                    gm.stratValidationErrors = [];
                    gm.stratIsValid = true;
                    gm.proposedStratPosition = null;
                });
            this.peers = groupMembers.filter(gm => gm.studentId !== this.me.studentId);
            this.me = groupMembers.filter(gm => gm.studentId === this.me.studentId)[0];
            this.me.updateStatusOfPeer();
            groupMembers.forEach(gm => { gm['stratText'] = (this.me.statusOfPeer[gm.studentId].stratComplete) ? this.me.statusOfPeer[gm.studentId].stratedPosition : 'None'; });
            this.log.success('Stratifications Updated!', null, true);
        });
    }

    protected switchView(view: StudListViews): void {

        if (view === StudListViews.None) return null;

        if (view === StudListViews.StratList) {
            if (this.activeView === StudListViews.StratList) return null;
            this.evaluateStrat();
            this.activeView = StudListViews.StratList;
        }

        if (view !== StudListViews.StratList && this.activeView === StudListViews.StratList) {
            this.handleUnsavedStrats()
                .then(() => this.activeView = view);
        }

        this.activeView = view;
    }
}

const enum SortOpt {
    Student,
    Assess,
    Comment,
    Strat,
}

const enum StudListViews {
    None,
    PeerList,
    StratList
}