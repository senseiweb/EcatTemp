import * as _mp from 'core/common/mapStrings'
import {CrseStudInGrpExtBase, CrseStudInGrpInit} from 'core/entityExtension/crseStudentInGroup'

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase implements ecat.entity.ext.IFacCrseStudInGrpExt {

    private _statusOfStudent: ecat.entity.ext.IFacCrseStudInGrpStatus = null;

    updateStatusOfStudent(): ecat.entity.ext.IFacCrseStudInGrpStatus {

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

        const gaveBo: ecat.entity.ext.ISpGaveStatusBreakOut = {
            gaveHE: null,
            gaveIE: null,
            gaveE: null,
            gaveND: null
        };


        const studStrat = facStats.filter(strat => strat.assesseePersonId === this.studentId && !!strat.stratPosition)[0];

        const stratComplete = !!studStrat;

        const stratedPosition = (stratComplete) ? studStrat.stratPosition : null;

        const spResponses = facResponses.filter(response => response.assesseePersonId === this.studentId);

        const hasComment = facComments.some(comment => comment.recipientPersonId === this.studentId);

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
            case knownReponse.eu:
                cummScore += 3;
                bo.E += 1;
                break;
            case knownReponse.ea:
                cummScore += 4;
                bo.E += 1;
                break;
            case knownReponse.heu:
                cummScore += 5;
                bo.HE += 1;
                break;
            case knownReponse.hea:
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
            //Divide by 6 values instead of 7 so if all scores are IEA the outcome is 0 and HEA is 100. 
            composite = (cummScore / (this.workGroup.assignedSpInstr.inventoryCollection.length * 6) * 100);
            composite = Math.round(composite);
        }

        const { HE, E, IE, ND } = bo;

        const chartData = [];
        chartData.push({ label: 'Highly Effective', data: HE, color: '#00308F' });
        chartData.push({ label: 'Effective', data: E, color: '#00AA58' });
        chartData.push({ label: 'Ineffective', data: IE, color: '#AA0000' });
        chartData.push({ label: 'Not Display', data: ND, color: '#AAAAAA' });


        let totalMarkings = 0;
        let totalHe = 0;
        let totalE = 0;
        let totalIe = 0;
        let totalNd = 0;

        const peers = this.workGroup.groupMembers.filter(mem => mem.studentId !== this.studentId);

        peers.forEach((mem) => {
            const c = this.statusOfPeer[mem.studentId].breakout;
            const totalForPeer = c.E + c.HE + c.IE + c.ND;
            totalMarkings += totalForPeer;
            totalE += c.E;
            totalHe += c.HE;
            totalIe += c.IE;
            totalNd += c.ND;

        });

        gaveBo.gaveHE = (totalHe / totalMarkings * 100);
        gaveBo.gaveE = (totalE / totalMarkings * 100);
        gaveBo.gaveIE = (totalIe / totalMarkings * 100);
        gaveBo.gaveND = (totalNd / totalMarkings * 100);

        const { gaveHE, gaveE, gaveIE, gaveND } = gaveBo;

        const gaveChartData = [];

        gaveChartData.push({ label: 'Highly Effective', data: gaveHE, color: '#00308F' });
        gaveChartData.push({ label: 'Effective', data: gaveE, color: '#00AA58' });
        gaveChartData.push({ label: 'Ineffective', data: gaveIE, color: '#AA0000' });
        gaveChartData.push({ label: 'Not Display', data: gaveND, color: '#AAAAAA' });

        this._statusOfStudent =  {
            assessComplete: missingItems.length === 0,
            stratComplete: stratComplete,
            hasComment: hasComment,
            missingAssessItems: missingItems,
            breakout: bo,
            gaveBreakOut: gaveBo,
            breakOutChartData: chartData,
            gaveBreakOutChartData: gaveChartData,
            compositeScore: composite,
            stratedPosition: stratedPosition
        }
    }

    numberOfAuthorComments = null;
    
    get statusOfStudent(): ecat.entity.ext.IFacCrseStudInGrpStatus {

        if (this._statusOfStudent) {
            return this._statusOfStudent;
        }
        this.updateStatusOfStudent();
        return this._statusOfStudent;

    }
};


export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: any) => new CrseStudInGrpInit(crseStudInGrp)
}

