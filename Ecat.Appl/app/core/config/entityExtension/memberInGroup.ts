import * as AppVar from "appVars"

export class MemberInGroupInitizer {

    constructor(memberInGrpEntity: ecat.entity.IMemberInGroup) {
        const group = memberInGrpEntity.group;
          if (group && group.assignedSpInstr && memberInGrpEntity.groupPeers) {
              memberInGrpEntity.getMigStatus();
          }
    }

}

export class MemberInGroupExt implements ecat.entity.ext.IMemberInGrpExt {
    private id: number;
    private assessorSpResponses: Array<ecat.entity.ISpAssessResponse>;
    private group: ecat.entity.IWorkGroup;
    private groupPeers: Array<ecat.entity.IMemberInGroup>;
    private _migStatus: ecat.entity.ext.IMemberInGrpSpStatus;    

    statusOfPeer: ecat.entity.ext.IStatusOfPeer = {} ;

    getMigStatus = () => {
        this.groupPeers.forEach((gm) => {
            let cummScore = 0;
            const migStatus: ecat.entity.ext.IMemberInGrpSpStatus = {
                assessComplete: false,
                stratComplete: false,
                isPeerAllComplete: false,
                missingAssessItems: [],
                breakout: { ineff: 0, nd: 0, eff: 0, highEff: 0 },
                compositeScore: 0,
                hasComment: false
            }

            const responseList = gm.assesseeSpResponses
                .filter(response => response.assessorId === this.id && response.assesseeId === gm.id);

            migStatus.stratComplete = !!gm.assesseeStratResponse
                .filter(strat => strat.assessorId === this.id &&
                    strat.assesseeId === gm.id &&
                    (strat.stratPosition !== null || strat.stratPosition !== undefined || strat.stratPosition !== 0))[0];

            migStatus.hasComment = !!gm.recipientOfComments
                .filter(comment => comment.authorId === this.id &&
                    comment.recipientId === gm.id)[0];

            const knownReponse = AppVar.EcSpItemResponse;

            responseList.forEach(response => {

                switch (response.mpItemResponse) {

                    case knownReponse.Iea:
                        migStatus.breakout.ineff += 1;
                        cummScore += 0;
                        break;
                    case knownReponse.Ieu:
                        migStatus.breakout.ineff += 1;
                        cummScore += 1;
                        break;
                    case knownReponse.Nd:
                        cummScore += 2;
                        migStatus.breakout.nd += 1;
                        break;
                    case knownReponse.Ea:
                        cummScore += 3;
                        migStatus.breakout.eff += 1;
                        break;
                    case knownReponse.Eu:
                        cummScore += 4;
                        migStatus.breakout.eff += 1;
                        break;
                    case knownReponse.Hea:
                        cummScore += 5;
                        migStatus.breakout.highEff += 1;
                        break;
                    case knownReponse.Heu:
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

            this.statusOfPeer[gm.id] = migStatus;
        });
    }

}

export var memberInGrpEntityExt: ecat.entity.IEntityExtension = {
    entityName: AppVar.EcMapEntityType.grpMember,
    ctorFunc: MemberInGroupExt,
    initFunc: (memberInGrpEntity: ecat.entity.IMemberInGroup) => new MemberInGroupInitizer(memberInGrpEntity)
}