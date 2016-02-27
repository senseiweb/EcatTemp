import IDataCtx from "core/service/data/context"
import IScore from "core/service/scoring"
import * as AppVar from "appVars"

interface IResultsByPeer {
    [peerId: number]: IResults
}

interface IResults {
    assessment: string,
    strat: number
}

export default class EcFacCapstoneDetailsModal {
    static controllerId = 'app.facilitator.features.groups.capstonestudentdetails';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, IScore.serviceId];

    nf: angular.IFormController;

    studentGMs: ecat.entity.IMemberInGroup[] = [];
    radioResponseType: string;
    assesseeByPeer: IResultsByPeer = {};
    assessorByPeer: IResultsByPeer = {};
    selectedAssess: Ecat.Shared.Model.SpAssessResponse[] = [];

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private score: IScore) {
        this.dCtx.facilitator.getStudentCapstoneDetails()
            .then((retData: Array<ecat.entity.IMemberInGroup>) => {
                this.studentGMs = retData;
                console.log(this.studentGMs);
                console.log(this.studentGMs[0].student.person.lastName + ' Capstone Data Loaded');
                this.activate();
            });
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

                results.assessment = this.score.getCompositeResultString(peer.statusOfPeer[gm.id].compositeScore);

                results.strat = peer.assessorStratResponse[0].stratPosition;

                //var strat = peer.assessorStratResponse.filter(strat => {
                //    if (strat.assesseeId === gm.id) { return true; }
                //    return false;
                //});

                //if (strat.length === 1) {
                //    results.strat = strat[0].stratPosition;
                //}

                this.assesseeByPeer[peer.id] = results;
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
                    results.assessment = this.score.getCompositeResultString(gm.statusOfPeer[peer.id].compositeScore);

                    results.strat = peer.assesseeStratResponse[0].stratPosition;

                    this.assessorByPeer[peer.id] = results;
                });
            });
        }
    }

    popBehaviors(peer: ecat.entity.IMemberInGroup): void {
        //var findGM = this.studentGMs.filter(gm => {
        //    if (gm.groupId === peer.groupId) { return true; }
        //    return false;
        //});
        //var selStudGMId = findGM[0].id;

        if (this.radioResponseType === 'Assessee') {
            this.selectedAssess = peer.assessorSpResponses;
            //this.selectedAssess = peer.assessorSpResponses.filter(resp => {
            //    if (resp.assesseeId === selStudGMId) { return true; }
            //    return false;
            //});
        } else if (this.radioResponseType === 'Assessor') {
            this.selectedAssess = peer.assesseeSpResponses;
            //this.selectedAssess = peer.assesseeSpResponses.filter(resp => {
            //    if (resp.assesseeId === selStudGMId) { return true; }
            //    return false;
            //});
        }
    }

    //getResultString(respScore: number): string {
    //    if (respScore < .17) { return 'Ineffective Always'; }
    //    if (respScore >= .17 && respScore < .34) { return 'Ineffective Usually'; }
    //    if (respScore >= .34 && respScore < .5) { return 'Not Displayed'; }
    //    if (respScore >= .5 && respScore < .67) { return 'Effective Usually'; }
    //    if (respScore >= .67 && respScore < .84) { return 'Effective Always'; }
    //    if (respScore >= .84 && respScore < 1) { return 'Highly Effective Usually'; }
    //    if (respScore >= 1) { return 'Highly Effective Always'; }
    //}

    close(): void {
        this.$mi.dismiss();
    }
}