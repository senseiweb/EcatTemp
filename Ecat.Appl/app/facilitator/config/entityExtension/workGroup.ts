import * as AppVar from "appVars"

export class FacWorkGroupInitizer {

    constructor(facWorkGrouppEntity: ecat.entity.IFacWorkGroup) {
        if (facWorkGrouppEntity.assignedSpInstr && facWorkGrouppEntity.groupMembers) {
            facWorkGrouppEntity.getFacAssessStatus();
        }
    }

}

export class FacWorkGroupExt implements ecat.entity.ext.IFacWorkGroupExt {
    private id: number;
    private facSpAssessResponses: Array<ecat.entity.IFacSpAssess>;
    private facSpStratResponses: Array<ecat.entity.IFacSpStratResponse>;
    private facSpComments: Array<ecat.entity.IFacSpComment>;
    private groupMembers: Array<ecat.entity.IMemberInGroup>;
    private assignedSpInstr: ecat.entity.ISpInstrument;

    statusOfStudent: ecat.entity.ext.IStatusOfPeer = {};

    getFacAssessStatus = () => {
        this.groupMembers.forEach((gm) => {
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

            const responseList = this.facSpAssessResponses
                .filter(response => response.assesseeId === gm.id);

            migStatus.stratComplete = !!this.facSpStratResponses
                .filter(strat => strat.assesseeId === gm.id &&
                    (strat.stratPosition !== null || strat.stratPosition !== undefined || strat.stratPosition !== 0))[0];

            migStatus.hasComment = !!this.facSpComments
                .filter(comment => comment.recipientId === gm.id)[0];

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

            if (this.assignedSpInstr) {
                this.assignedSpInstr
                    .inventoryCollection
                    .forEach(inventoryItem => {
                        const hasResponse = responseList.some(response => response.inventoryItemId === inventoryItem.id);
                        if (!hasResponse) {
                            migStatus.missingAssessItems.push(inventoryItem.id);
                        }
                    });

                migStatus.compositeScore = cummScore / (this.assignedSpInstr.inventoryCollection.length * 6);
            }


            migStatus.assessComplete = migStatus.missingAssessItems.length === 0;


            migStatus.isPeerAllComplete = migStatus.assessComplete && migStatus.stratComplete;

            this.statusOfStudent[gm.id] = migStatus;
        });
    }

}

export var facWorkGrpEntityExt: ecat.entity.IEntityExtension = {
    entityName: AppVar.EcMapEntityType.grpMember,
    ctorFunc: FacWorkGroupExt,
    initFunc: (FacWorkGrpEntity: ecat.entity.IFacWorkGroup) => new FacWorkGroupInitizer(FacWorkGrpEntity)
}