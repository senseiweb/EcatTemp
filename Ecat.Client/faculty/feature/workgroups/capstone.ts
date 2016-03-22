import IDataCtx from 'core/service/data/context'
import * as _mp from 'core/common/mapStrings'

interface IResultsByPeer {
    [peerId: number]: IResults
}

interface IResults {
    assessment: string,
    strat: number;
}

export default class EcFacCapstoneDetailsModal {
    static controllerId = 'app.faculty.features.groups.capstonestudentdetails';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId];

    nf: angular.IFormController;

    studentGMs: ecat.entity.ICrseStudInGroup[] = [];
    radioResponseType: string;
    assesseeByPeer: any = {};
    assessorByPeer: any = {};
    selectedAssess: any[] = [];

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx) {
        //this.dCtx.faculty.getStudentCapstoneDetails()
        //    .then((retData: Array<ecat.entity.IMemberInGroup>) => {
        //        this.studentGMs = retData;
        //        console.log(this.studentGMs);
        //        this.activate();
        //    });
    }

    activate(): void {
        this.radioResponseType = 'Assessee';
        this.studentGMs.forEach(gm => {
            gm.groupPeers.forEach(peer => {
                var results: IResults = {
                    assessment: '',
                    strat: 0
                };
                //var resultsAgg = 0;

                //peer.assessorSpResponses.forEach(resp => {
                //    results.assessment += resp.itemModelScore
                //});

                //var responses = peer.assessorSpResponses.filter(resp => {
                //    if (resp.assesseeId === gm.id) { return true; }
                //    return false;
                //});

                //responses.forEach(resp => {
                //    resultsAgg += resp.itemModelScore;
                //});

                results.assessment = this.getResultString(peer.statusOfPeer[gm.studentId].compositeScore);

                results.strat = peer.assessorStratResponse[0].stratPosition;

                //var strat = peer.assessorStratResponse.filter(strat => {
                //    if (strat.assesseeId === gm.id) { return true; }
                //    return false;
                //});

                //if (strat.length === 1) {
                //    results.strat = strat[0].stratPosition;
                //}

                this.assesseeByPeer[peer.studentId] = results;
            });
        });
    }

    calcAssessor(): void {
        if (this.assessorByPeer === null || this.assessorByPeer === undefined) {
            this.studentGMs.forEach(gm => {
                gm.groupPeers.forEach(peer => {
                    var results: IResults = {
                        assessment: '',
                        strat: 0
                    };
                    results.assessment = this.getResultString(gm.statusOfPeer[gm.studentId].compositeScore);

                    results.strat = peer.assesseeStratResponse[0].stratPosition;

                    this.assessorByPeer[peer.studentId] = results;
                });
            });
        }
    }

    popBehaviors(peer: ecat.entity.ICrseStudInGroup): void {
        if (this.radioResponseType === 'Assessee') {
            this.selectedAssess = peer.assessorSpResponses;

        } else if (this.radioResponseType === 'Assessor') {
            this.selectedAssess = peer.assesseeSpResponses;
        }
    }

    getResultString(respScore: number): string {
        if (respScore < .17) { return 'Ineffective Always'; }
        if (respScore >= .17 && respScore < .34) { return 'Ineffective Usually'; }
        if (respScore >= .34 && respScore < .5) { return 'Not Displayed'; }
        if (respScore >= .5 && respScore < .67) { return 'Effective Usually'; }
        if (respScore >= .67 && respScore < .84) { return 'Effective Always'; }
        if (respScore >= .84 && respScore < 1) { return 'Highly Effective Usually'; }
        if (respScore >= 1) { return 'Highly Effective Always'; }
    }

    close(): void {
        this.$mi.dismiss();
    }
}