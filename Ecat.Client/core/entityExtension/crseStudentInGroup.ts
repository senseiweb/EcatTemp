import * as _mp from 'core/common/mapStrings'

export class CrseStudInGrpInit {
    constructor(memberInGrpEntity: ecat.entity.ICrseStudInGroup) { }
}

export class CrseStudInGrpExtBase implements ecat.entity.ext.ICrseStudInGrpExt {
    protected entityId: string;
    protected studentId: number;
    protected assessorSpResponses: Array<ecat.entity.ISpResponse>;
    protected workGroup: ecat.entity.IWorkGroup;
    private _sigStatus: ecat.entity.ext.ICrseStudInGrpStatus;

    chartSopData: Array<any> = [];
    chartOptions =  {
       
    }

    statusOfPeer: ecat.entity.ext.IStatusOfPeer = {};

    getSigStatus = (refresh?: boolean) => {
        if (!this.workGroup) {
            console.log('Unable to update status missing assign workgroup');
            return null;
        }

        if (this._sigStatus && !refresh) {
            return this._sigStatus;
        }

        const groupPeers = this.workGroup.groupMembers;

        groupPeers.forEach((gm) => {
            let cummScore = 0;
            const sigStatus: ecat.entity.ext.ICrseStudInGrpStatus = {
                assessComplete: false,
                stratComplete: false,
                isPeerAllComplete: false,
                missingAssessItems: [],
                breakout: { IE: 0, ND: 0, E: 0, HE: 0 },
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
                .filter(response => response.assessorPersonId === this.studentId && response.assesseePersonId === gm.studentId);

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
            }
            );

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

                sigStatus.compositeScore = cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6);
            }


            sigStatus.assessComplete = sigStatus.missingAssessItems.length === 0;


            sigStatus.isPeerAllComplete = sigStatus.assessComplete && sigStatus.stratComplete;

            this.statusOfPeer[gm.studentId.toString()] = this._sigStatus = sigStatus;

            let compositeTotal = 0;
            for (let item in sigStatus.breakout) {
                if (sigStatus.breakout.hasOwnProperty(item)) {
                    compositeTotal += sigStatus.breakout[item];
                  }
            }

            for (let item in sigStatus.breakout) {
                if (sigStatus.breakout.hasOwnProperty(item)) {
                    const bo = sigStatus.breakout;

                    if (bo[item] > 0) {
                        let label = 'Unknown';
                        let color = '';

                        switch (item) {
                        case 'HE':
                            label = `Highly Effective: [${bo[item]}]`;
                            color = '#F44336';
                                break;
                        case 'E':
                            label = `Effective: [${bo[item]}]`;
                            color = '#03A9F4';
                            break;
                        case 'IE':
                            label = `Ineffective [${bo[item]}]`;
                            color = '#8BC34A';
                            break;
                        case 'ND':
                            label = `Not Displayed [${bo[item]}]`;
                            color = '#FFEB3B';
                            break;
                        }

                        this.chartSopData.push({ label: label, data: (bo[item] / compositeTotal) * 100, color: color });
                    }
                }
            }
        });
    }
}

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase { }

export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: ecat.entity.ICrseStudInGroup) => new CrseStudInGrpInit(crseStudInGrp)
}

