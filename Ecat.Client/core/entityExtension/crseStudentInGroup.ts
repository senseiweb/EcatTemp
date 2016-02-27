import * as _mp from "core/common/mapStrings"

export class CrseStudInGrpInit {

    constructor(memberInGrpEntity: ecat.entity.ICrseStudInGroup) {
        const group = memberInGrpEntity.group;
        if (group && group.assignedSpInstr && memberInGrpEntity.groupPeers) {
            memberInGrpEntity.getMigStatus();
        }
    }

}

export class CrseStudInGrpExt implements ecat.entity.ext.ICrseStudInGrpExt {
    private entityId: string;
    private studentId: number;
    private assessorSpResponses: Array<ecat.entity.ISpRespnse>;
    private group: ecat.entity.IWorkGroup;
    private groupPeers: Array<ecat.entity.ICrseStudInGroup>;
    private _migStatus: ecat.entity.ext.ICrseStudInGroupStatus;

    statusOfPeer: ecat.entity.ext.IStatusOfPeer = {};

    getMigStatus = () => {
        this.groupPeers.forEach((gm) => {
            let cummScore = 0;
            const migStatus: ecat.entity.ext.ICrseStudInGroupStatus = {
                assessComplete: false,
                stratComplete: false,
                isPeerAllComplete: false,
                missingAssessItems: [],
                breakout: { ineff: 0, nd: 0, eff: 0, highEff: 0 },
                compositeScore: 0,
                hasComment: false
            }

            const responseList = gm.assesseeSpResponses
                .filter(response => response.assesseePersonId === this.studentId && response.assessor.entityId === gm.entityId);

            migStatus.stratComplete = !!gm.assesseeStratResponse
                .filter(strat => strat.assessorPersonId === this.studentId &&
                    strat.assesseePersonId === gm.studentId &&
                    (strat.stratPosition !== null || strat.stratPosition !== undefined || strat.stratPosition !== 0))[0];

            migStatus.hasComment = !!gm.recipientOfComments
                .filter(comment => comment.authorPersonId === this.studentId &&
                    comment.recipientPersonId === gm.studentId)[0];

            const knownReponse = _mp.EcSpItemResponse;

            responseList.forEach(response => {

                    switch (response.mpItemResponse) {

                    case knownReponse.iea:
                        migStatus.breakout.ineff += 1;
                        cummScore += 0;
                        break;
                    case knownReponse.ieu:
                        migStatus.breakout.ineff += 1;
                        cummScore += 1;
                        break;
                    case knownReponse.nd:
                        cummScore += 2;
                        migStatus.breakout.nd += 1;
                        break;
                    case knownReponse.ea:
                        cummScore += 3;
                        migStatus.breakout.eff += 1;
                        break;
                    case knownReponse.eu:
                        cummScore += 4;
                        migStatus.breakout.eff += 1;
                        break;
                    case knownReponse.hea:
                        cummScore += 5;
                        migStatus.breakout.highEff += 1;
                        break;
                    case knownReponse.heu:
                        cummScore += 6;
                        migStatus.breakout.highEff += 1;
                        break;
                    default:
                        break;
                    }
                }
            );

            if (this.group && this.group.assignedSpInstr) {
                this.group
                    .assignedSpInstr
                    .inventoryCollection
                    .forEach(inventoryItem => {
                        const hasResponse = responseList.some(response => response.inventoryItemId === inventoryItem.id);
                        if (!hasResponse) {
                            migStatus.missingAssessItems.push(inventoryItem.id);
                        }
                    });

                migStatus.compositeScore = cummScore / (this.group.assignedSpInstr.inventoryCollection.length * 6);
            }


            migStatus.assessComplete = migStatus.missingAssessItems.length === 0;


            migStatus.isPeerAllComplete = migStatus.assessComplete && migStatus.stratComplete;

            this.statusOfPeer[gm.entityId] = migStatus;
        });
    }
}

export var memberInGrpEntityExt: ecat.entity.IEntityExtension = {
    entityName: _mp.EcMapEntityType.grpMember,
    ctorFunc: CrseStudInGrpExt,
    initFunc: (crseStudInGrp: ecat.entity.ICrseStudInGroup) => new CrseStudInGrpInit(crseStudInGrp)
}