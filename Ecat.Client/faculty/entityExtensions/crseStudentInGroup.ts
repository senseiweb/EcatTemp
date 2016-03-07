import * as _mp from 'core/common/mapStrings'
import {CrseStudInGrpExtBase, CrseStudInGrpInit} from 'core/entityExtension/crseStudentInGroup'

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase implements ecat.entity.ext.IFacCrseStudInGrpExt {

    numberOfAuthorComments = null;
    
    get statusOfStudent(): ecat.entity.ext.IFacCrseStudInGrpStatus {
        if (!this.workGroup) {
            console.log('Unable to update status missing assign workgroup');
            return null;
        }

        let cummScore = 0;
        const missingItems = [];
        let composite = null;
        const facResponses = this.workGroup.facSpResponses;
        const facComments = this.workGroup.facSpComments;
        const facStats = this.workGroup.facStratResponses;
        const bo: ecat.entity.ext.ISpStatusBreakOut = {
            HE: null,
            IE: null,
            E: null,
            ND: null
        };

        const studStrat = facStats.filter(strat => strat.assesseePersonId === this.studentId && !!strat.stratPosition)[0];

        const stratComplete = !!studStrat;

        const stratedPosition = (stratComplete) ? studStrat.stratPosition : null;

        const spResponses = facResponses.filter(response => response.assesseePersonId === this.studentId);

        const hasComment = facComments.some(comment => comment.studentPersonId === this.studentId);

        const knownReponse = _mp.EcSpItemResponse;

        spResponses.forEach(response => {

            switch (response.mpItemResponse) {
            case knownReponse.iea:
                bo.IE += 1;
                cummScore += 0;
                break;
            case knownReponse.ieu:
                bo.IE += 1;
                cummScore += 1;
                break;
            case knownReponse.nd:
                cummScore += 2;
                bo.ND += 1;
                break;
            case knownReponse.ea:
                cummScore += 3;
                bo.E += 1;
                break;
            case knownReponse.eu:
                cummScore += 4;
                bo.E += 1;
                break;
            case knownReponse.hea:
                cummScore += 5;
                bo.HE += 1;
                break;
            case knownReponse.heu:
                cummScore += 6;
                bo.HE += 1;
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
                    const hasResponse = spResponses.some(response => response.inventoryItemId === inventoryItem.id);
                    if (!hasResponse) {
                        missingItems.push(inventoryItem.id);
                    }
                });

            composite = (cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6)).toFixed(2);
            composite = composite * 100;
        }

        const { HE, E, IE, ND } = this.statusOfStudent.breakout;

        const chartData = [];
        chartData.push({ label: 'High Effective', data: HE, color: '#AAAA00' });
        chartData.push({ label: 'Effective', data: E, color: '#00AA58' });
        chartData.push({ label: 'Ineffective', data: IE, color: '#AA0000' });
        chartData.push({ label: 'Not Display', data: ND, color: '#AAAAAA' });

        return {
            assessComplete: missingItems.length === 0,
            stratComplete: stratComplete,
            hasComment: hasComment,
            missingAssessItems: missingItems,
            breakout: bo,
            breakOutChartData: chartData,
            compositeScore: composite,
            stratedPosition: stratedPosition
        }

      
    }
};


export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: any) => new CrseStudInGrpInit(crseStudInGrp)
}

