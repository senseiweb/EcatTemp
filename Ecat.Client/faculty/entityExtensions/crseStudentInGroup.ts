import * as _mp from "core/common/mapStrings"
import {CrseStudInGrpExtBase, CrseStudInGrpInit} from "core/entityExtension/crseStudentInGroup"

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase implements ecat.entity.ext.IFacCrseStudInGrpExt {
    numberOfAuthorComments = null;

    private _facSpStatus: ecat.entity.ext.IFacCrseStudInGrpStatus;
    
    statusOfStudent: ecat.entity.ext.IFacCrseStudInGrpStatus = null;

    chartSosData: Array<any> = [];

    getFacSpStatus = (refresh?: boolean) => {
        if (!this.workGroup) {
            console.log('Unable to update status missing assign workgroup');
            return null;
        }

        if (this._facSpStatus && !refresh) {
            return this._facSpStatus;
        }

        let cummScore = 0;
        const missingItems = [];
        let comosite = null;
        const facResponses = this.workGroup.facSpResponses;
        const facComments = this.workGroup.facSpResponses;
        const facStats = this.workGroup.facStratResponses;
        const bo: any = {
            he: null,
            ie: null,
            e: null,
            nd: null
        };

        const studStrat = facStats.filter(strat => strat.assesseePersonId === this.studentId && !!strat.stratPosition)[0];

        const stratComplete = !!studStrat;

        const stratedPosition = (stratComplete) ? studStrat.stratPosition : null;

        const spResponses = facResponses.filter(response => response.assesseePersonId === this.studentId);

        const hasComment = facComments.some(comment => comment.assesseePersonId === this.studentId);

        const knownReponse = _mp.EcSpItemResponse;

        spResponses.forEach(response => {

            switch (response.mpItemResponse) {
            case knownReponse.iea:
                bo.ie += 1;
                cummScore += 0;
                break;
            case knownReponse.ieu:
                bo.ie += 1;
                cummScore += 1;
                break;
            case knownReponse.nd:
                cummScore += 2;
                bo.nd += 1;
                break;
            case knownReponse.ea:
                cummScore += 3;
                bo.e += 1;
                break;
            case knownReponse.eu:
                cummScore += 4;
                bo.e += 1;
                break;
            case knownReponse.hea:
                cummScore += 5;
                bo.he += 1;
                break;
            case knownReponse.heu:
                cummScore += 6;
                bo.he += 1;
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

            comosite = cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6);
        }

        this._facSpStatus = this.statusOfStudent = {
            assessComplete: missingItems.length === 0,
            stratComplete: stratComplete,
            hasComment: hasComment,
            missingAssessItems: missingItems,
            breakout: bo,
            compositeScore: comosite,
            stratedPosition: stratedPosition
        };

        let compositeTotal = 0;

        for (let item in this.statusOfStudent.breakout) {
            if (this.statusOfStudent.breakout.hasOwnProperty(item)) {
                compositeTotal += this.statusOfStudent.breakout[item];
            }
        }

        this.chartSosData.push({ label: 'Effective', data: 5, color: '#00AA58' });
        this.chartSosData.push({ label: 'High Effective', data: 2, color: '#AAAA00' });
        this.chartSosData.push({ label: 'Ineffective', data: 1, color: '#AA0000' });
        this.chartSosData.push({ label: 'Not Display', data: 2, color: '#AAAAAA' });

        //for (let item in this.statusOfStudent.breakout) {
        //    if (this.statusOfStudent.breakout.hasOwnProperty(item)) {
        //        const boi = this.statusOfStudent.breakout;

        //        if (boi[item] > 0) {
        //            let label = 'Unknown';
        //            let color = '';

        //            switch (item) {
        //            case 'HE':
        //                label = `Highly Effective: [${boi[item]}]`;
        //                color = '#F44336';
        //                break;
        //            case 'E':
        //                label = `Effective: [${boi[item]}]`;
        //                color = '#03A9F4';
        //                break;
        //            case 'IE':
        //                label = `Ineffective [${boi[item]}]`;
        //                color = '#8BC34A';
        //                break;
        //            case 'ND':
        //                label = `Not Displayed [${boi[item]}]`;
        //                color = '#FFEB3B';
        //                break;
        //            }

        //            this.chartSosData.push({ label: label, data: (boi[item] / compositeTotal) * 100, color: color });
        //        }
        //    }
        //}
    }
};


export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: any) => new CrseStudInGrpInit(crseStudInGrp)
}

