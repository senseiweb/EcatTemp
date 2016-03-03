import * as _mp from "core/common/mapStrings"
import {CrseStudInGrpExtBase, CrseStudInGrpInit} from "core/entityExtension/crseStudentInGroup"

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase implements ecat.entity.ext.IFacCrseStudInGrpExt {
    numberOfAuthorComments = null;
    private _facSpStatus: ecat.entity.ext.IFacCrseStudInGrpStatus;
    
    statusOfStudent: ecat.entity.ext.IFacCrseStudInGrpStatus = null;
    
    getFacSpStatus = (refresh?: boolean) => {
        if(!this.workGroup) {
            console.log('Unable to update status missing assign workgroup');
            return null;
        }
        
        if (this._facSpStatus && !refresh) {
            return this._facSpStatus;
        }
        
        const groupMembers = this.workGroup.groupMembers;
        const facResponses = this.workGroup.facSpResponses;
        const facComments = this.workGroup.facSpResponses;
        const facStats = this.workGroup.facStratResponses;
        
        groupMembers.forEach(gm => {
            let cummScore = 0;
            const facSpStatus: ecat.entity.ext.IFacCrseStudInGrpStatus = {
                assessComplete: false,
                stratComplete: false,
                hasComment: false,
                missingAssessItems: [],
                breakout: {IE: 0, ND: 0, E: 0, HE: 0},
                compositeScore: 0,
                stratedPosition: null
            }
            
           const studStrat = facStats.filter(strat => strat.assesseePersonId === gm.studentId && !!strat.stratPosition)[0];
            
            facSpStatus.stratComplete = !!studStrat;
            
            facSpStatus.stratedPosition = (facSpStatus.stratComplete) ? studStrat.stratPosition : null;
            
            const spResponses = facResponses.filter(response => response.assesseePersonId === gm.studentId);
            
            facSpStatus.hasComment = facComments.some(comment => comment.assesseePersonId === gm.studentId);
            
            const knownReponse = _mp.EcSpItemResponse;
            
            facResponses.forEach(response => {

                switch (response.mpItemResponse) {
                    case knownReponse.iea:
                        facSpStatus.breakout.IE += 1;
                        cummScore += 0;
                        break;
                    case knownReponse.ieu:
                        facSpStatus.breakout.IE += 1;
                        cummScore += 1;
                        break;
                    case knownReponse.nd:
                        cummScore += 2;
                        facSpStatus.breakout.ND += 1;
                        break;
                    case knownReponse.ea:
                        cummScore += 3;
                        facSpStatus.breakout.E += 1;
                        break;
                    case knownReponse.eu:
                        cummScore += 4;
                        facSpStatus.breakout.E += 1;
                        break;
                    case knownReponse.hea:
                        cummScore += 5;
                        facSpStatus.breakout.HE += 1;
                        break;
                    case knownReponse.heu:
                        cummScore += 6;
                        facSpStatus.breakout.HE += 1;
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
                        const hasResponse = facResponses.some(response => response.inventoryItemId === inventoryItem.id);
                        if (!hasResponse) {
                            facSpStatus.missingAssessItems.push(inventoryItem.id);
                        }
                    });
                 
              facSpStatus.compositeScore = cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6)
            }
            
            facSpStatus.assessComplete = facSpStatus.missingAssessItems.length === 0;
            this._facSpStatus  = this.statusOfStudent = facSpStatus;
        })
        
    }
}

export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: any) => new CrseStudInGrpInit(crseStudInGrp)
}

