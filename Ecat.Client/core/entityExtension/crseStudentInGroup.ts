﻿import * as _mp from 'core/common/mapStrings'

export class CrseStudInGrpInit {
    constructor(memberInGrpEntity: ecat.entity.ICrseStudInGroup) { }
}

export class CrseStudInGrpExtBase implements ecat.entity.ext.ICrseStudInGrpExt {
    protected entityId: string;
    protected studentId: number;
    protected studentProfile: ecat.entity.IStudentProfile;
    protected assessorSpResponses: Array<ecat.entity.ISpResponse>;
    protected workGroup: ecat.entity.IWorkGroup;
    protected _sop: ecat.entity.ext.IStatusOfPeer = null;
    
    updateStatusOfPeer(): ecat.entity.ext.IStatusOfPeer {
        const groupPeers = this.workGroup.groupMembers;
        groupPeers.forEach((gm) => {
            let cummScore = 0;

            const sigStatus: ecat.entity.ext.ICrseStudInGrpStatus = {
                assessComplete: false,
                stratComplete: false,
                isPeerAllComplete: false,
                missingAssessItems: [],
                breakout: { IE: 0, ND: 0, E: 0, HE: 0 },
                breakOutChartData: [],
                compositeScore: 0,
                stratedPosition: null,
                hasComment: false
            }

            const peerStrat = gm.assesseeStratResponse
                .filter(strat => strat.assessorPersonId === this.studentId &&
                    strat.assesseePersonId === gm.studentId &&
                    !!strat.stratPosition)[0];

            sigStatus.stratComplete = !!peerStrat;

            sigStatus.stratedPosition = (sigStatus.stratComplete) ? peerStrat.stratPosition : null;

            sigStatus.hasComment = !!gm.recipientOfComments
                .filter(comment => comment.authorPersonId === this.studentId &&
                    comment.recipientPersonId === gm.studentId)[0];

            const knownReponse = _mp.EcSpItemResponse;

            const responseList = gm.assesseeSpResponses
                .filter(response => response.assessorPersonId === this.studentId &&
                    response.assesseePersonId === gm.studentId);

            responseList.forEach(response => {

                switch (response.mpItemResponse) {

                    case knownReponse.iea:
                        sigStatus.breakout.IE += 1;
                        cummScore += 0;
                        break;
                    case knownReponse.ieu:
                        sigStatus.breakout.IE += 1;
                        cummScore += 1;
                        break;
                    case knownReponse.nd:
                        cummScore += 2;
                        sigStatus.breakout.ND += 1;
                        break;
                    case knownReponse.ea:
                        cummScore += 3;
                        sigStatus.breakout.E += 1;
                        break;
                    case knownReponse.eu:
                        cummScore += 4;
                        sigStatus.breakout.E += 1;
                        break;
                    case knownReponse.hea:
                        cummScore += 5;
                        sigStatus.breakout.HE += 1;
                        break;
                    case knownReponse.heu:
                        cummScore += 6;
                        sigStatus.breakout.HE += 1;
                        break;
                    default:
                        break;
                }
            });

            if (this.workGroup.assignedSpInstr) {
                this.workGroup
                    .assignedSpInstr
                    .inventoryCollection
                    .forEach(inventoryItem => {
                        const hasResponse = responseList.some(response => response.inventoryItemId === inventoryItem.id);
                        if (!hasResponse) {
                            sigStatus.missingAssessItems.push(inventoryItem.id);
                        }
                    });

                cummScore = (cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6)) * 100;
                sigStatus.compositeScore = parseFloat(cummScore.toFixed(2));
            }

            sigStatus.assessComplete = sigStatus.missingAssessItems.length === 0;

            sigStatus.isPeerAllComplete = sigStatus.assessComplete && sigStatus.stratComplete;

            const { HE, E, IE, ND } = sigStatus.breakout;

            sigStatus.breakOutChartData.push({ label: 'High Effective', data: HE, color: '#AAAA00' });
            sigStatus.breakOutChartData.push({ label: 'Effective', data: E, color: '#00AA58' });
            sigStatus.breakOutChartData.push({ label: 'Ineffective', data: IE, color: '#AA0000' });
            sigStatus.breakOutChartData.push({ label: 'Not Display', data: ND, color: '#AAAAAA' });

            this._sop[gm.studentId.toString()] = sigStatus;
        });
        return this._sop;
    }

    get rankName(): string {
        return (!this.studentProfile) ? 'Unknown' : `${this.studentProfile.person.saluatation} ${this.studentProfile.person.lastName}, ${this.studentProfile.person.firstName}`;
    }

    get nameSorter() {
        return {
            last: (this.studentProfile && this.studentProfile.person) ? this.studentProfile.person.lastName : 'Unknown',
            first: (this.studentProfile && this.studentProfile.person) ? this.studentProfile.person.firstName : 'Unknown'
        }
    }

    get statusOfPeer(): ecat.entity.ext.IStatusOfPeer {
        if (!this.workGroup) {
            console.log('Unable to update status missing assign workgroup');
            return null;
        }
        console.log(`ran sop check for ${this.studentId}`);
        if (this._sop) {
            return this._sop;
        }
        this._sop = {};
        this.updateStatusOfPeer();
        return this._sop;
    }
}
