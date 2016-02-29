import * as _mp from "core/common/mapStrings"

export class CrseStudInGrpInit {

    constructor(memberInGrpEntity: ecat.entity.ICrseStudInGroup) { }

}

export class CrseStudInGrpExtBase implements ecat.entity.ext.ICrseStudInGrpExt {
    private entityId: string;
    private studentId: number;
    private assessorSpResponses: Array<ecat.entity.ISpResponse>;
    private workGroup: ecat.entity.IWorkGroup;
    private _migStatus: ecat.entity.ext.ICrseStudInGroupStatus;

    statusOfPeer: ecat.entity.ext.IStatusOfPeer = {};

    getMigStatus = () => {
        if (!this.workGroup) {
            return null;
        }
        const groupPeers = this.workGroup.groupMembers;
        groupPeers.forEach((gm) => {
            let cummScore = 0;
            const migStatus: ecat.entity.ext.ICrseStudInGroupStatus = {
                assessComplete: false,
                stratComplete: false,
                isPeerAllComplete: false,
                missingAssessItems: [],
                breakout: { IE: 0, ND: 0, E: 0, HE: 0 },
                compositeScore: 0,
                stratedPosition: null,
                hasComment: false
            }

            const responseList = gm.assesseeSpResponses
                .filter(response => response.assessorPersonId === this.studentId && response.assesseePersonId === gm.studentId);

            migStatus.stratComplete = !!gm.assesseeStratResponse
                .filter(strat => strat.assessorPersonId === this.studentId &&
                    strat.assesseePersonId === gm.studentId &&
                    (strat.stratPosition !== null || strat.stratPosition !== undefined || strat.stratPosition !== 0))[0];

            migStatus.stratedPosition = (migStatus.stratComplete) ? gm.assesseeStratResponse.filter(strat => strat.assessorPersonId === this.studentId && strat.assesseePersonId === gm.studentId)[0].stratPosition : null;

            migStatus.hasComment = !!gm.recipientOfComments
                .filter(comment => comment.authorPersonId === this.studentId &&
                    comment.recipientPersonId === gm.studentId)[0];

            const knownReponse = _mp.EcSpItemResponse;

            responseList.forEach(response => {

                    switch (response.mpItemResponse) {

                    case knownReponse.iea:
                        migStatus.breakout.IE += 1;
                        cummScore += 0;
                        break;
                    case knownReponse.ieu:
                        migStatus.breakout.IE += 1;
                        cummScore += 1;
                        break;
                    case knownReponse.nd:
                        cummScore += 2;
                        migStatus.breakout.ND += 1;
                        break;
                    case knownReponse.ea:
                        cummScore += 3;
                        migStatus.breakout.E += 1;
                        break;
                    case knownReponse.eu:
                        cummScore += 4;
                        migStatus.breakout.E += 1;
                        break;
                    case knownReponse.hea:
                        cummScore += 5;
                        migStatus.breakout.HE += 1;
                        break;
                    case knownReponse.heu:
                        cummScore += 6;
                        migStatus.breakout.HE += 1;
                        break;
                    default:
                        break;
                    }
                }
            );

            if (this.workGroup && this.workGroup.assignedSpInstr) {
                this.workGroup
                    .assignedSpInstr
                    .inventoryCollection
                    .forEach(inventoryItem => {
                        const hasResponse = responseList.some(response => response.inventoryItemId === inventoryItem.id);
                        if (!hasResponse) {
                            migStatus.missingAssessItems.push(inventoryItem.id);
                        }
                    });

                migStatus.compositeScore = cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6);
            }


            migStatus.assessComplete = migStatus.missingAssessItems.length === 0;


            migStatus.isPeerAllComplete = migStatus.assessComplete && migStatus.stratComplete;

            this.statusOfPeer[gm.studentId.toString()] = migStatus;
        });
    }
}

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase { }

export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: ecat.entity.ICrseStudInGroup) => new CrseStudInGrpInit(crseStudInGrp)
}

