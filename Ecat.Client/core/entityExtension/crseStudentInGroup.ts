import * as _mp from "core/common/mapStrings"

export class CrseStudInGrpInit {
    constructor(memberInGrpEntity: ecat.entity.ICrseStudInGroup) { }
}

export class CrseStudInGrpExtBase implements ecat.entity.ext.ICrseStudInGrpExt {
    protected entityId: string;
    protected studentId: number;
    protected assessorSpResponses: Array<ecat.entity.ISpResponse>;
    protected workGroup: ecat.entity.IWorkGroup;
    private _sigStatus: ecat.entity.ext.ICrseStudInGrpStatus;

    options =  {
        series: {
            pie: {
                show: true,
                stroke: {
                    width: 2
                }
            },
            legend: {
                container: '.flc-pie',
                backgroundOpacity: 0.5,
                noColumns: 0,
                backgroundColor: "white",
                lineWidth: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: true,
            tooltipOpts: {
                content: '%p.0%, %s', // show percentages, rounding to 2 decimal places
                shifts: {
                    x: 20,
                    y: 0
                },
                defaultTheme: false,
                cssClass: 'flot-tooltip'
            }
        }
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
        });
    }
}

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase { }

export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: ecat.entity.ICrseStudInGroup) => new CrseStudInGrpInit(crseStudInGrp)
}

